// services/soilDataService.ts

interface SoilGridsResponse {
  properties: {
    layers: Array<{
      name: string;
      depths: Array<{
        range: string;
        values: {
          "Q0.5": number; // median value
        };
      }>;
    }>;
  };
}

interface SoilData {
  nitrogen: number | string;
  phosphorus: number | string;
  potassium: number | string;
  ph: number | string;
  organicMatter: number | string;
}

export class SoilDataService {
  private static readonly SOILGRIDS_API_BASE = 'https://rest.isric.org/soilgrids/v2.0';
  private static readonly DEFAULT_DEPTH = '0-5cm'; // Top soil layer
  
  // Rate limiting: 5 calls per minute as per API documentation
  private static lastCallTime = 0;
  private static callCount = 0;
  
  private static async rateLimitCheck(): Promise<void> {
    const now = Date.now();
    const oneMinute = 60 * 1000;
    
    if (now - this.lastCallTime > oneMinute) {
      this.callCount = 0;
      this.lastCallTime = now;
    }
    
    if (this.callCount >= 5) {
      const waitTime = oneMinute - (now - this.lastCallTime);
      throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds`);
    }
    
    this.callCount++;
  }

  static async fetchSoilData(latitude: number, longitude: number): Promise<SoilData> {
    await this.rateLimitCheck();
    
    // Properties we want to fetch from SoilGrids
    const properties = [
      'nitrogen',     // Total nitrogen content
      'phh2o',       // pH in H2O
      'soc',         // Soil organic carbon (we'll convert to organic matter)
      'cec',         // Cation exchange capacity (related to P/K availability)
    ];
    
    const propertyParams = properties.map(p => `property=${p}`).join('&');
    const url = `${this.SOILGRIDS_API_BASE}/properties/query?lon=${longitude}&lat=${latitude}&${propertyParams}&depth=${this.DEFAULT_DEPTH}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`SoilGrids API error: ${response.status} ${response.statusText}`);
      }
      
      const data: SoilGridsResponse = await response.json();
      return this.parseSoilGridsResponse(data);
      
    } catch (error) {
      console.error('Error fetching soil data:', error);
      throw error;
    }
  }
  
  private static parseSoilGridsResponse(data: SoilGridsResponse): SoilData {
    const layers = data.properties.layers;
    
    // Find values for each property
    const nitrogenLayer = layers.find(l => l.name === 'nitrogen');
    const phLayer = layers.find(l => l.name === 'phh2o');
    const socLayer = layers.find(l => l.name === 'soc');
    const cecLayer = layers.find(l => l.name === 'cec');
    
    // Extract median values and convert units
    const nitrogen = nitrogenLayer?.depths[0]?.values?.["Q0.5"] 
      ? this.convertNitrogen(nitrogenLayer.depths[0].values["Q0.5"]) : "-";

    const ph = phLayer?.depths[0]?.values?.["Q0.5"] 
      ? this.convertPH(phLayer.depths[0].values["Q0.5"]) : "-";

    const organicMatter = socLayer?.depths[0]?.values?.["Q0.5"] 
      ? this.convertOrganicCarbon(socLayer.depths[0].values["Q0.5"]) : "-";

    // For P and K, we'll estimate based on CEC and organic matter
    const cec = cecLayer?.depths[0]?.values?.["Q0.5"];
    const { phosphorus, potassium } = cec 
      ? this.estimatePhosphorusAndPotassium(cec, typeof nitrogen === 'number' ? nitrogen : 0)
      : { phosphorus: "-", potassium: "-" };
    
    return {
      nitrogen: typeof nitrogen === 'number' ? Math.round(nitrogen * 100) / 100 : nitrogen,
      phosphorus: typeof phosphorus === 'number' ? Math.round(phosphorus * 100) / 100 : phosphorus,
      potassium: typeof potassium === 'number' ? Math.round(potassium * 100) / 100 : potassium,
      ph: typeof ph === 'number' ? Math.round(ph * 10) / 10 : ph,
      organicMatter: typeof organicMatter === 'number' ? Math.round(organicMatter * 100) / 100 : organicMatter
    };
  }
  
  private static convertNitrogen(value: number): number {
    // SoilGrids nitrogen is in cg/kg (centigrams per kilogram)
    // Convert to percentage: cg/kg * 0.01 / 10 = percentage
    return (value * 0.001);
  }
  
  private static convertPH(value: number): number {
    // SoilGrids pH is multiplied by 10, so divide by 10
    return value / 10;
  }
  
  private static convertOrganicCarbon(value: number): number {
    // SoilGrids SOC is in dg/kg (decigrams per kilogram)
    // Convert to organic matter percentage: SOC * 1.724 (standard conversion factor)
    return (value / 100) * 1.724;
  }
  
  private static estimatePhosphorusAndPotassium(cec: number, nitrogen: number): { phosphorus: number; potassium: number } {
    // These are rough estimates based on soil science relationships
    // In practice, you'd need actual P and K testing data
    
    // Higher CEC generally indicates better nutrient retention
    // Higher organic matter usually correlates with better P availability
    // base N:P:K ratio
    let phosphorus = nitrogen * (2 / 4);
    let potassium = nitrogen * (1 / 4);

    if (cec !== undefined) {
      // tweak values based on CEC
      // assume CEC ranges ~5–50 cmol/kg (just as a rough guide)
      const minCEC = 5;   // realistic lower bound
      const maxCEC = 50;  // realistic upper bound
      const clampedCEC = Math.max(minCEC, Math.min(maxCEC, cec)); // clamp to 5–50

      const cecFactor = (clampedCEC - minCEC) / (maxCEC - minCEC); // normalize 0–1
      const boost = 0.02 + cecFactor * 0.18; // gives 0.02–0.2
      phosphorus += boost;
      potassium += boost / 2; // maybe less impact on K
    }

    return {
      phosphorus: Math.round(phosphorus * 1000) / 1000,
      potassium: Math.round(potassium * 1000) / 1000
    };
  }
  
  // Fallback method using browser geolocation
  static async getCurrentLocationSoilData(): Promise<SoilData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const soilData = await this.fetchSoilData(
              position.coords.latitude, 
              position.coords.longitude
            );
            resolve(soilData);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        { timeout: 10000 }
      );
    });
  }
  
  // Geocoding fallback for city/state
  static async getSoilDataFromLocation(city: string, state: string, country: string = 'IN'): Promise<SoilData> {
    // Use a simple geocoding approach (you might want to use a proper geocoding API)
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${city},${state},${country}`;
    
    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error(`Could not find coordinates for ${city}, ${state}`);
      }
      
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      
      return await this.fetchSoilData(lat, lon);
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }
}
