import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { weatherService } from '@/services/weatherService';

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const country = searchParams.get('country');

    let weatherResult;

    if (lat && lon) {
      weatherResult = await weatherService.getWeatherData(
        parseFloat(lat), 
        parseFloat(lon)
      );
    } else if (city && state) {
      weatherResult = await weatherService.getWeatherFromLocation(
        city,
        state,
        country || undefined
      );
    } else {
      weatherResult = {
        current: {
          temp: "-", humidity: "-", rainfall: "-", condition: "-", 
          rainChance: "-", windSpeed: "-", description: "-"
        },
        weeklyForecast: Array(5).fill(null).map((_, i) => ({
          day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : ['Wed', 'Thu', 'Fri'][i-2] || 'N/A',
          temp: "-", condition: "-", humidity: "-", wind: "-", description: "-"
        })),
        alerts: [{ type: "info" as const, message: "Location data needed for weather", severity: "low" as const }]
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        current: weatherResult.current,
        weeklyForecast: weatherResult.weeklyForecast,
        alerts: weatherResult.alerts
      }
    });

  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch weather data'
    }, { status: 500 });
  }
});
