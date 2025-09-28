import { Prisma } from "@/generated/prisma";
import { WeatherData, WeatherAlert, ForecastDay } from '@/services/weatherService';

type Farmer = Prisma.FarmerGetPayload<{
  include: {
    crops: true;
    settings: true;
  }
}>;

interface MainCardsProps {
  farmerData: Farmer | null
  farmerLoading: boolean
  weatherData: WeatherData | null
  weatherLoading: boolean
  weatherError: string | null
  weatherAlerts: WeatherAlert[]
  weeklyForecast: ForecastDay[]
  soilData: {
    nitrogen: number | string;
    phosphorus: number | string;
    potassium: number | string;
    ph: number | string;
    organicMatter: number | string;
  }
  soilDataLoading: boolean
  soilDataError: string | null
}

const MainCards = ({
  farmerData,
  farmerLoading,
  weatherData,
  weatherLoading,
  weatherError,
  weatherAlerts,
  weeklyForecast,
  soilData,
  soilDataLoading,
  soilDataError
}: MainCardsProps) => {
  const currentCrops = farmerData?.crops?.map((crop) => ({
    id: crop.id,
    name: crop.name,
    variety: crop.variety,
    status: crop.status,
    plantedDate: crop.plantedDate,
    harvestDate: crop.harvestDate,
    quantity: crop.quantity,
    notes: crop.notes
  })) || [];

  const getStatusDisplay = (status: string | undefined) => {
    if (!status) return 'Unknown';
    
    const statusMap: Record<string, string> = {
      'PLANTED': 'Planted',
      'GROWING': 'Growing', 
      'READY_FOR_HARVEST': 'Ready for Harvest',
      'HARVESTED': 'Harvested',
      'FAILED': 'Failed'
    };
    
    return statusMap[status] || status;
  };

  function formatRevenue(amount: number): string {
    if (amount >= 1_00_00_000) { 
      // 1 crore and above
      return (amount / 1_00_00_000).toFixed(1).replace(/\.0$/, '') + "C"
    } else if (amount >= 1_00_000) {
      // 1 lakh and above
      return (amount / 1_00_000).toFixed(1).replace(/\.0$/, '') + "L"
    } else if (amount >= 1_000) {
      // 1k and above
      return (amount / 1_000).toFixed(1).replace(/\.0$/, '') + "k"
    } else {
      return amount.toString()
    }
  }

  if (!farmerData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">No farmer data available</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
      {/* Farm Overview Card - Top Left */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-3 sm:p-4 md:p-6 border-b">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Farm Overview</h2>
        </div>
        <div className="p-3 sm:p-4 md:p-6">
          {/* Farm Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                {farmerLoading ? (
                  <div className="h-6 sm:h-7 md:h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  farmerData?.settings?.farmSize || 0
                )}
              </div>
              <div className="text-xs text-gray-600">Total Acres</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                {farmerLoading ? (
                  <div className="h-6 sm:h-7 md:h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  farmerData?.crops?.length || 0
                )}
              </div>
              <div className="text-xs text-gray-600">Active Crops</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600">
                {farmerLoading ? (
                  <div className="h-6 sm:h-7 md:h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  `₹${farmerData?.revenue ? formatRevenue(farmerData.revenue) : '0'}`
                )}
              </div>
              <div className="text-xs text-gray-600">Est. Revenue</div>
            </div>
          </div>

          {/* Soil Health Section */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Soil Health (NPK)</h3>
            
            {/* Soil Data Error */}
            {soilDataError && (
              <div className="mb-3 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-xs sm:text-sm font-medium text-red-800">
                  Failed to load soil data
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3">
              <div className={`text-center p-2 sm:p-3 rounded-lg ${soilDataLoading ? 'bg-gray-100 animate-pulse' : 'bg-blue-50'}`}>
                <div className={`text-sm sm:text-base md:text-lg font-bold ${soilDataLoading ? 'text-gray-400' : 'text-blue-600'}`}>
                  {soilDataLoading ? (
                    <div className="h-5 sm:h-6 md:h-7 bg-gray-200 rounded mx-auto w-8"></div>
                  ) : (
                    `${soilData.nitrogen}${soilData.nitrogen !== "-" ? "%" : ""}`
                  )}
                </div>
                <div className={`text-xs ${soilDataLoading ? '' : 'text-gray-600'}`}>
                  {soilDataLoading ? (
                    <div className="mt-2 h-3 bg-gray-200 rounded mx-auto w-20"></div>
                  ) : (
                    "Nitrogen"
                  )}
                </div>
              </div>
              <div className={`text-center p-2 sm:p-3 rounded-lg ${soilDataLoading ? 'bg-gray-100 animate-pulse' : 'bg-green-50'}`}>
                <div className={`text-sm sm:text-base md:text-lg font-bold ${soilDataLoading ? 'text-gray-400' : 'text-green-600'}`}>
                  {soilDataLoading ? (
                    <div className="h-5 sm:h-6 md:h-7 bg-gray-200 rounded mx-auto w-8"></div>
                  ) : (
                    `${soilData.phosphorus}${soilData.phosphorus !== "-" ? "%" : ""}`
                  )}
                </div>
                <div className={`text-xs ${soilDataLoading ? '' : 'text-gray-600'}`}>
                  {soilDataLoading ? (
                    <div className="mt-2 h-3 bg-gray-200 rounded mx-auto w-20"></div>
                  ) : (
                    "Phosphorus"
                  )}
                </div>
              </div>
              <div className={`text-center p-2 sm:p-3 rounded-lg ${soilDataLoading ? 'bg-gray-100 animate-pulse' : 'bg-purple-50'}`}>
                <div className={`text-sm sm:text-base md:text-lg font-bold ${soilDataLoading ? 'text-gray-400' : 'text-purple-600'}`}>
                  {soilDataLoading ? (
                    <div className="h-5 sm:h-6 md:h-7 bg-gray-200 rounded mx-auto w-8"></div>
                  ) : (
                    `${soilData.potassium}${soilData.potassium !== "-" ? "%" : ""}`
                  )}
                </div>
                <div className={`text-xs ${soilDataLoading ? '' : 'text-gray-600'}`}>
                  {soilDataLoading ? (
                    <div className="mt-2 h-3 bg-gray-200 rounded mx-auto w-20"></div>
                  ) : (
                    "Potassium"
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className={`text-center p-2 sm:p-3 rounded-lg ${soilDataLoading ? 'bg-gray-100 animate-pulse' : 'bg-yellow-50'}`}>
                <div className={`text-sm sm:text-base md:text-lg font-bold ${soilDataLoading ? 'text-gray-400' : 'text-yellow-600'}`}>
                  {soilDataLoading ? (
                    <div className="h-5 sm:h-6 md:h-7 bg-gray-200 rounded mx-auto w-8"></div>
                  ) : (
                    soilData.ph
                  )}
                </div>
                <div className={`text-xs ${soilDataLoading ? '' : 'text-gray-600'}`}>
                  {soilDataLoading ? (
                    <div className="mt-2 h-3 bg-gray-200 rounded mx-auto w-28"></div>
                  ) : (
                    "pH Level"
                  )}
                </div>
              </div>
              <div className={`text-center p-2 sm:p-3 rounded-lg ${soilDataLoading ? 'bg-gray-100 animate-pulse' : 'bg-orange-50'}`}>
                <div className={`text-sm sm:text-base md:text-lg font-bold ${soilDataLoading ? 'text-gray-400' : 'text-orange-600'}`}>
                  {soilDataLoading ? (
                    <div className="h-5 sm:h-6 md:h-7 bg-gray-200 rounded mx-auto w-8"></div>
                  ) : (
                    `${soilData.organicMatter}${soilData.organicMatter !== "-" ? "%" : ""}`
                  )}
                </div>
                <div className={`text-xs ${soilDataLoading ? '' : 'text-gray-600'}`}>
                  {soilDataLoading ? (
                    <div className="mt-2 h-3 bg-gray-200 rounded mx-auto w-28"></div>
                  ) : (
                    "Organic Matter"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Overview Card - Top Right */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-3 sm:p-4 md:p-6 border-b">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Weather Overview</h2>
        </div>
        <div className="p-3 sm:p-4 md:p-6">
          {/* Weather Data Error */}
          {weatherError && (
            <div className="mb-3 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-xs sm:text-sm font-medium text-red-800">
                Failed to load weather data
              </div>
            </div>
          )}
          
          {weatherLoading ? (
            <div className="animate-pulse">
              {/* Skeleton Current Weather */}
              <div className="text-center mb-4 sm:mb-6">
                <div className="h-10 sm:h-12 md:h-16 bg-gray-200 rounded-lg mb-2 mx-auto w-24"></div>
                <div className="h-4 bg-gray-200 rounded mx-auto w-32 mb-3"></div>
              </div>
              
              {/* Skeleton Weather Details */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="h-6 sm:h-8 bg-gray-200 rounded mx-auto w-12 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded mx-auto w-16"></div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="h-6 sm:h-8 bg-gray-200 rounded mx-auto w-12 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded mx-auto w-20"></div>
                </div>
              </div>

              {/* Skeleton Alert */}
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="p-2 sm:p-3 rounded-lg border-l-4 bg-gray-50 border-gray-300">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          ) : weatherData ? (
            <>
              {/* Current Weather */}
              <div className="text-center mb-4 sm:mb-6">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {weatherData.temp}{weatherData.temp !== "-" ? "°C" : ""}
                </div>
                <div className="text-sm text-gray-600 mb-3 sm:mb-4">{weatherData.condition}</div>
              </div>
              
              {/* Weather Details */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                    {weatherData.humidity}{weatherData.humidity !== "-" ? "%" : ""}
                  </div>
                  <div className="text-xs text-gray-600">Humidity</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                    {weatherData.rainChance}{weatherData.rainChance !== "-" ? "%" : ""}
                  </div>
                  <div className="text-xs text-gray-600">Rain Chance</div>
                </div>
              </div>

              {/* Weather Alert */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Current Alert</h3>
                <div className="p-2 sm:p-3 rounded-lg border-l-4 bg-yellow-50 border-yellow-400">
                  <div className="text-xs sm:text-sm font-medium text-yellow-800">
                    {weatherAlerts[0]?.message || "No alerts"}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">Weather data unavailable</div>
          )}
        </div>
      </div>

      {/* Active Crops Card - Bottom Left */}
      <div className="bg-white rounded-lg shadow-sm border order-3 lg:order-3">
        <div className="p-3 sm:p-4 md:p-6 border-b">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Active Crops</h2>
        </div>
        <div className="p-3 sm:p-4 md:p-6">
          {farmerLoading ? (
            <div className="space-y-2 sm:space-y-3 animate-pulse">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <div className="h-4 sm:h-5 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-48"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : currentCrops.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-sm">No crops planted yet</div>
              <div className="text-xs mt-1">Add your first crop to get started</div>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {currentCrops.map((crop) => (
                <div key={crop.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm sm:text-base">{crop.name}</span>
                      {crop.variety && (
                        <span className="text-xs text-gray-500">({crop.variety})</span>
                      )}
                      <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                        crop.status === 'HARVESTED' ? 'bg-green-100 text-green-800' :
                        crop.status === 'READY_FOR_HARVEST' ? 'bg-yellow-100 text-yellow-800' :
                        crop.status === 'GROWING' ? 'bg-blue-100 text-blue-800' :
                        crop.status === 'PLANTED' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getStatusDisplay(crop.status)}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {crop.plantedDate && `Planted: ${new Date(crop.plantedDate).toLocaleDateString()}`}
                      {crop.harvestDate && ` • Harvest: ${new Date(crop.harvestDate).toLocaleDateString()}`}
                      {crop.quantity && ` • ${crop.quantity} kg`}
                    </div>
                    {crop.notes && (
                      <div className="text-xs text-gray-500 mt-1">{crop.notes}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5-Day Forecast Card - Bottom Right */}
      <div className="bg-white rounded-lg shadow-sm border order-4 lg:order-4">
        <div className="p-3 sm:p-4 md:p-6 border-b">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">5-Day Forecast</h2>
        </div>
        <div className="p-3 sm:p-4 md:p-6">
          {/* Weather Data Error */}
          {weatherError && (
            <div className="mb-3 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-xs sm:text-sm font-medium text-red-800">
                Failed to load weather data
              </div>
            </div>
          )}
          
          {weatherLoading ? (
            <div className="animate-pulse space-y-1 sm:space-y-2">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1 sm:space-y-2">
              {weeklyForecast.map((day, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-gray-600 w-16">{day.day}</span>
                    <span className="text-xs sm:text-sm">{day.condition}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <span className="font-medium">
                      {day.temp}{day.temp !== "-" ? "°C" : ""}
                    </span>
                    <span className="text-gray-500">
                      {day.humidity}{day.humidity !== "-" ? "%" : ""}
                    </span>
                    <span className="text-gray-500">{day.wind}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MainCards
