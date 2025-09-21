// services/weatherService.ts
export interface WeatherData {
  temp: number | string;
  humidity: number | string;
  rainfall: number | string;
  condition: string;
  rainChance: number | string;
  windSpeed: string;
  description: string;
}

export interface WeatherAlert {
  type: "warning" | "info" | "error";
  message: string;
  severity: "low" | "medium" | "high";
}

export interface ForecastDay {
  day: string;
  temp: number | string;
  condition: string;
  humidity: number | string;
  wind: string;
  description: string;
}

class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
  }

  private getWeatherEmoji(iconCode: string): string {
    const iconMap: Record<string, string> = {
      '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '⛅',
      '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '-';
  }

  private getEmptyData() {
    return {
      current: {
        temp: "-",
        humidity: "-",
        rainfall: "-",
        condition: "-",
        rainChance: "-",
        windSpeed: "-",
        description: "-"
      },
      weeklyForecast: [
        { day: "Today", temp: "-", condition: "-", humidity: "-", wind: "-", description: "-" },
        { day: "Tomorrow", temp: "-", condition: "-", humidity: "-", wind: "-", description: "-" },
        { day: "Day After", temp: "-", condition: "-", humidity: "-", wind: "-", description: "-" },
        { day: "Thu", temp: "-", condition: "-", humidity: "-", wind: "-", description: "-" },
        { day: "Fri", temp: "-", condition: "-", humidity: "-", wind: "-", description: "-" }
      ],
      alerts: [{ type: "error" as const, message: "Weather data unavailable", severity: "low" as const }]
    };
  }

  async getWeatherData(lat: number, lon: number) {
    if (!this.apiKey) {
      console.warn('OpenWeather API key not configured');
      return this.getEmptyData();
    }

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`),
        fetch(`${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`)
      ]);

      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error('Weather API request failed');
      }

      const [weather, forecast] = await Promise.all([
        weatherRes.json(),
        forecastRes.json()
      ]);

      const current: WeatherData = {
        temp: Math.round(weather.main.temp),
        humidity: weather.main.humidity,
        rainfall: weather.rain?.['1h'] || 0,
        condition: weather.weather[0].main,
        rainChance: weather.clouds.all,
        windSpeed: `${Math.round(weather.wind.speed * 3.6)} km/h`,
        description: weather.weather[0].description
      };

      const weeklyForecast: ForecastDay[] = forecast.list
        .filter((_: any, index: number) => index % 8 === 0)
        .slice(0, 5)
        .map((item: any, index: number) => ({
          day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : 
               new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          temp: Math.round(item.main.temp),
          condition: this.getWeatherEmoji(item.weather[0].icon),
          humidity: item.main.humidity,
          wind: `${Math.round(item.wind.speed * 3.6)} km/h`,
          description: item.weather[0].description
        }));

      const alerts: WeatherAlert[] = [];
      if (typeof current.temp === 'number' && current.temp > 35) {
        alerts.push({ type: "warning", message: "High temperature - protect crops", severity: "high" });
      }
      if (typeof current.rainChance === 'number' && current.rainChance > 80) {
        alerts.push({ type: "info", message: "High chance of rain", severity: "low" });
      }
      if (!alerts.length) {
        alerts.push({ type: "info", message: "Weather conditions are normal", severity: "low" });
      }

      return { current, weeklyForecast, alerts };
    } catch (error) {
      console.error('Weather service error:', error);
      return this.getEmptyData();
    }
  }

  async getWeatherFromLocation(city: string, state?: string, country?: string) {
    if (!this.apiKey) {
      console.warn('OpenWeather API key not configured');
      return this.getEmptyData();
    }

    try {
      const locationQuery = `${city}${state ? `,${state}` : ''}${country ? `,${country}` : ''}`;
      const geoRes = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationQuery)}&limit=1&appid=${this.apiKey}`
      );
      
      if (!geoRes.ok) {
        throw new Error('Geocoding API request failed');
      }
      
      const geoData = await geoRes.json();
      
      if (geoData && geoData.length > 0) {
        return this.getWeatherData(geoData[0].lat, geoData[0].lon);
      }
      
      throw new Error('Location not found');
    } catch (error) {
      console.error('Weather geocoding error:', error);
      return this.getEmptyData();
    }
  }
}

export const weatherService = new WeatherService();
