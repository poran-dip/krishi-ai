import { Prisma } from "@/generated/prisma";
import { authUtils } from "@/lib/auth";
import { useEffect, useState } from "react";

type Farmer = Prisma.FarmerGetPayload<{
  include: {
    crops: true;
    settings: true;
  }
}>;

const MainCards = () => {
  const [farmerData, setFarmerData] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
          const token = authUtils.getToken();
          const response = await fetch('/api/v1/protected/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

        if (response.ok) {
          const result = await response.json();
          setFarmerData(result.data);
        }
      } catch (error) {
        console.error('Error fetching farmer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerData();
  }, []);

  const currentCrops = farmerData?.crops?.map((crop, _index) => ({
    id: crop.id,
    name: crop.name,
    variety: crop.variety,
    status: crop.status,
    plantedDate: crop.plantedDate,
    harvestDate: crop.harvestDate,
    quantity: crop.quantity,
    notes: crop.notes
  })) || [];

  // Keep weather-related mock data as requested
  const soilData = {
    nitrogen: 85,
    phosphorus: 78,
    potassium: 92,
    ph: 6.8,
    organicMatter: 4.2
  };

  const weatherData = {
    temp: 28,
    humidity: 65,
    rainfall: 12,
    condition: "Partly Cloudy"
  };

  const weatherAlerts = [
    { type: "warning", message: "High winds expected tomorrow", severity: "medium" },
    { type: "info", message: "Perfect conditions for irrigation", severity: "low" }
  ];

  const weeklyForecast = [
    { day: "Today", temp: 28, condition: "⛅", humidity: 65, wind: "12 km/h" },
    { day: "Tomorrow", temp: 26, condition: "🌧️", humidity: 78, wind: "8 km/h" },
    { day: "Day After", temp: 29, condition: "☀️", humidity: 58, wind: "15 km/h" },
    { day: "Thu", temp: 31, condition: "☀️", humidity: 52, wind: "10 km/h" },
    { day: "Fri", temp: 27, condition: "⛅", humidity: 70, wind: "14 km/h" }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
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
                {farmerData.settings?.farmSize || 0}
              </div>
              <div className="text-xs text-gray-600">Total Acres</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                {farmerData.crops?.length || 0}
              </div>
              <div className="text-xs text-gray-600">Active Crops</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600">
                ₹{farmerData.revenue ? `${(farmerData.revenue / 1000).toFixed(0)}k` : '0k'}
              </div>
              <div className="text-xs text-gray-600">Est. Revenue</div>
            </div>
          </div>

          {/* Soil Health Section */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Soil Health (NPK)</h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3">
              <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                <div className="text-sm sm:text-base md:text-lg font-bold text-blue-600">{soilData.nitrogen}%</div>
                <div className="text-xs text-gray-600">Nitrogen</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                <div className="text-sm sm:text-base md:text-lg font-bold text-green-600">{soilData.phosphorus}%</div>
                <div className="text-xs text-gray-600">Phosphorus</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-purple-50 rounded-lg">
                <div className="text-sm sm:text-base md:text-lg font-bold text-purple-600">{soilData.potassium}%</div>
                <div className="text-xs text-gray-600">Potassium</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm sm:text-base md:text-lg font-bold text-yellow-600">{soilData.ph}</div>
                <div className="text-xs text-gray-600">pH Level</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-orange-50 rounded-lg">
                <div className="text-sm sm:text-base md:text-lg font-bold text-orange-600">{soilData.organicMatter}%</div>
                <div className="text-xs text-gray-600">Organic Matter</div>
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
          {/* Current Weather */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{weatherData.temp}°C</div>
            <div className="text-sm text-gray-600 mb-3 sm:mb-4">{weatherData.condition}</div>
          </div>
          
          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
            <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">{weatherData.humidity}%</div>
              <div className="text-xs text-gray-600">Humidity</div>
            </div>
            <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">75%</div>
              <div className="text-xs text-gray-600">Rain Chance</div>
            </div>
          </div>

          {/* Single Weather Alert */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Current Alert</h3>
            <div className="p-2 sm:p-3 rounded-lg border-l-4 bg-yellow-50 border-yellow-400">
              <div className="text-xs sm:text-sm font-medium text-yellow-800">
                {weatherAlerts[0].message}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Crops Card - Bottom Left */}
      <div className="bg-white rounded-lg shadow-sm border order-3 lg:order-3">
        <div className="p-3 sm:p-4 md:p-6 border-b">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Active Crops</h2>
        </div>
        <div className="p-3 sm:p-4 md:p-6">
          {currentCrops.length === 0 ? (
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
                        {crop.status.replace('_', ' ')}
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
          <div className="space-y-1 sm:space-y-2">
            {weeklyForecast.map((day, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600 w-16">{day.day}</span>
                  <span className="text-xs sm:text-sm">{day.condition}</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <span className="font-medium">{day.temp}°C</span>
                  <span className="text-gray-500">{day.humidity}%</span>
                  <span className="text-gray-500">{day.wind}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainCards
