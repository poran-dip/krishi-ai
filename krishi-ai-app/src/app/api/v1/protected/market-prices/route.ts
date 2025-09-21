// app/api/v1/protected/market-prices/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { marketPriceService } from '@/services/marketPriceService';

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const crops = searchParams.get('crops');

    // Parse crops if provided
    let farmerCrops: string[] | undefined;
    if (crops) {
      try {
        farmerCrops = JSON.parse(crops);
      } catch {
        // If parsing fails, treat as comma-separated string
        farmerCrops = crops.split(',').map(c => c.trim());
      }
    }

    // Get market prices based on location and crops
    const marketResult = await marketPriceService.getMarketPrices(
      lat ? parseFloat(lat) : undefined,
      lon ? parseFloat(lon) : undefined,
      city || undefined,
      state || undefined,
      farmerCrops
    );

    if (!marketResult.success) {
      return NextResponse.json({
        success: false,
        error: marketResult.error || 'Failed to fetch market prices'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        prices: marketResult.data,
        source: marketResult.source,
        location: city && state ? `${city}, ${state}` : state || 'Unknown',
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Market prices API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch market prices'
    }, { status: 500 });
  }
});
