// services/marketPriceService.ts

export interface MarketPrice {
  crop: string;
  price: number;
  change: string;
  changeValue: number;
  lastWeek: number;
  demand: 'Low' | 'Medium' | 'High' | 'Very High';
  quality: string;
  location: string;
  market?: string;
  unit?: string;
  lastUpdated?: string;
}

export interface MarketDataResponse {
  success: boolean;
  data?: MarketPrice[];
  error?: string;
  source?: string;
}

interface DataGovRecord {
  commodity?: string;
  modal_price?: string;
  min_price?: string;
  max_price?: string;
  variety?: string;
  market?: string;
  arrival_date?: string;
}

// Quality grades mapping
const QUALITY_GRADES = ['FAQ', 'Premium', 'Grade A', 'Grade B', 'Medium', 'Superior'];

// Demand calculation based on price trends
const calculateDemand = (currentPrice: number, avgPrice: number): MarketPrice['demand'] => {
  const priceRatio = currentPrice / avgPrice;
  if (priceRatio > 1.15) return 'Very High';
  if (priceRatio > 1.05) return 'High';
  if (priceRatio > 0.95) return 'Medium';
  return 'Low';
};

class MarketPriceService {
  private readonly DATA_GOV_BASE_URL = 'https://api.data.gov.in/resource';

  // Fallback mock data for when APIs are unavailable
  private getMockData(crops: string[], location: string): MarketPrice[] {
    const mockPrices: Record<string, Partial<MarketPrice>> = {
      'wheat': { crop: 'Wheat', price: 2150, change: '+5%', changeValue: 102.38, lastWeek: 2047.62 },
      'rice': { crop: 'Rice', price: 1980, change: '-2%', changeValue: -40.40, lastWeek: 2020.40 },
      'maize': { crop: 'Maize', price: 1750, change: '+8%', changeValue: 129.63, lastWeek: 1620.37 },
      'bajra': { crop: 'Bajra', price: 1650, change: '+3%', changeValue: 48.06, lastWeek: 1601.94 },
      'jowar': { crop: 'Jowar', price: 1580, change: '-1%', changeValue: -15.96, lastWeek: 1595.96 }
    };

    return crops.map(crop => {
      const mock = mockPrices[crop.toLowerCase()];
      if (!mock) return null;
      
      return {
        crop: mock.crop!,
        price: mock.price!,
        change: mock.change!,
        changeValue: mock.changeValue!,
        lastWeek: mock.lastWeek!,
        demand: calculateDemand(mock.price!, 1800), // Average base price
        quality: QUALITY_GRADES[Math.floor(Math.random() * QUALITY_GRADES.length)],
        location: location,
        unit: 'quintal',
        lastUpdated: new Date().toISOString()
      };
    }).filter(Boolean) as MarketPrice[];
  }

  // Get market prices using data.gov.in API
  async fetchFromDataGovIn(): Promise<MarketDataResponse> {
    try {
      const apiKey = process.env.DATA_GOV_IN_API_KEY;
      
      if (!apiKey) {
        console.warn('DATA_GOV_IN_API_KEY not configured');
        return { success: false, error: 'API key not configured' };
      }

      // Build URL with query parameters
      const params = new URLSearchParams({
        'api-key': apiKey,
        format: 'json',
        limit: '100'
      });

      const url = `${this.DATA_GOV_BASE_URL}/9ef84268-d588-465a-a308-a864a43d0070?${params.toString()}`;
      console.log('Fetching market prices from URL:', url);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data?.records) {
        const marketPrices = this.transformDataGovResponse(data.records);
        console.log('Records after transform/filter:', marketPrices.length);
        return { 
          success: true, 
          data: marketPrices,
          source: 'data.gov.in'
        };
      }

      return { success: false, error: 'No data available' };
    } catch (error) {
      console.error('Data.gov.in API error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { success: false, error: 'Request timeout' };
        }
        return { success: false, error: error.message };
      }
      
      return { success: false, error: 'API request failed' };
    }
  }

  // Transform data.gov.in response to our format
  private transformDataGovResponse(records: DataGovRecord[]): MarketPrice[] {
    console.log('Records before transform:', records.length);
  return records.map(record => {
    const currentPrice = parseFloat(record.modal_price || record.max_price || '0');
    const minPrice = parseFloat(record.min_price || String(currentPrice));
    const maxPrice = parseFloat(record.max_price || String(currentPrice));

    const lastWeekPrice = currentPrice * (0.95 + Math.random() * 0.1);
    const changeValue = currentPrice - lastWeekPrice;
    const changePercent = ((changeValue / lastWeekPrice) * 100).toFixed(1);

    return {
      crop: record.commodity || 'Unknown',
      price: currentPrice,
      change: `${changeValue > 0 ? '+' : ''}${changePercent}%`,
      changeValue: parseFloat(changeValue.toFixed(2)),
      lastWeek: parseFloat(lastWeekPrice.toFixed(2)),
      demand: calculateDemand(currentPrice, (minPrice + maxPrice) / 2),
      quality: record.variety || 'FAQ',
      location: `${record.market || 'Unknown'} Mandi`,
      unit: 'quintal',
      lastUpdated: record.arrival_date || new Date().toISOString().split('T')[0]
    };
  }).filter(item => item.price > 0);
}

  // Get nearby markets based on location
  private async getNearbyMarkets(state: string): Promise<string[]> {
    // This would ideally use a proper geolocation API
    // For now, return some common markets based on state
    const marketsByState: Record<string, string[]> = {
      'maharashtra': ['Pune', 'Mumbai', 'Nashik', 'Aurangabad', 'Nagpur'],
      'punjab': ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala'],
      'haryana': ['Karnal', 'Sirsa', 'Hisar', 'Kurukshetra'],
      'uttar pradesh': ['Kanpur', 'Lucknow', 'Agra', 'Varanasi'],
      'rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner'],
      'gujarat': ['Ahmedabad', 'Rajkot', 'Surat', 'Vadodara']
    };

    return marketsByState[state.toLowerCase()] || ['Local Market'];
  }

  // Main function to get market prices
  async getMarketPrices(
    latitude?: number,
    longitude?: number,
    city?: string,
    state?: string,
    farmerCrops?: string[]
  ): Promise<MarketDataResponse> {
    try {
      let location = 'Local Market';
      const crops = farmerCrops || ['wheat', 'rice', 'maize'];
      
      // Determine location string
      if (city && state) {
        location = `${city}, ${state}`;
      } else if (state) {
        location = state;
      }

      // Try data.gov.in API first
      if (state) {
        const apiResult = await this.fetchFromDataGovIn();
        
        if (apiResult.success && apiResult.data && apiResult.data.length > 0) {
          return {
            success: true,
            data: apiResult.data.slice(0, 5), // just take first 5 records
            source: apiResult.source
          };
        }
      }

      // Fallback to mock data
      console.log('Using mock market price data as fallback');
      const mockData = this.getMockData(crops, location);
      
      return {
        success: true,
        data: mockData,
        source: 'mock'
      };

    } catch (error) {
      console.error('Market price service error:', error);
      
      // Always return mock data as last resort
      const mockData = this.getMockData(farmerCrops || ['wheat', 'rice', 'maize'], 'Local Market');
      return {
        success: true,
        data: mockData,
        source: 'mock'
      };
    }
  }

  // Get price history for a specific crop
  async getPriceHistory(
    days: number = 30
  ): Promise<{ dates: string[], prices: number[] }> {
    // This would ideally fetch historical data from APIs
    // For now, generate mock historical data
    const dates: string[] = [];
    const prices: number[] = [];
    const basePrice = 1800;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
      
      // Generate realistic price fluctuation
      const fluctuation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const price = basePrice * (1 + fluctuation);
      prices.push(Math.round(price));
    }
    
    return { dates, prices };
  }
}

export const marketPriceService = new MarketPriceService();
export default marketPriceService;
