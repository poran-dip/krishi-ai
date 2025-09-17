import MarketInsightCard from "./MarketInsightCard"

const MarketPrices = () => {
    const marketPrices = [
    { 
      crop: "Wheat", 
      price: 2150, 
      change: "+5%", 
      changeValue: 102.38,
      lastWeek: 2047.62,
      demand: "High",
      quality: "Premium",
      location: "Pune Mandi"
    },
    { 
      crop: "Rice", 
      price: 1980, 
      change: "-2%", 
      changeValue: -40.40,
      lastWeek: 2020.40,
      demand: "Medium",
      quality: "Grade A",
      location: "Pune Mandi"
    },
    { 
      crop: "Maize", 
      price: 1750, 
      change: "+8%", 
      changeValue: 129.63,
      lastWeek: 1620.37,
      demand: "Very High",
      quality: "Premium",
      location: "Mumbai Mandi"
    }
  ];

  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
      <div className="p-3 sm:p-4 md:p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Live Market Prices</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm text-gray-500">Live</span>
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-4 md:p-6">
        <div className="space-y-3 sm:space-y-4">
          {marketPrices.map((item) => (
            <div key={item.crop} className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                {/* Left Section - Crop Info */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base">{item.crop[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{item.crop}</h3>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">{item.quality}</span>
                      <span>•</span>
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                {/* Middle Section - Price Info */}
                <div className="flex items-center justify-between sm:justify-center sm:flex-col sm:gap-1">
                  <div className="text-right sm:text-center">
                    <div className="text-lg sm:text-xl font-bold text-gray-900">₹{item.price.toLocaleString()}</div>
                    <div className="text-xs sm:text-sm text-gray-600">per quintal</div>
                  </div>
                </div>

                {/* Right Section - Change & Demand */}
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                  <div className="text-right">
                    <div className={`flex items-center gap-1 font-semibold text-sm sm:text-base ${
                      item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span>{item.change.startsWith('+') ? '↗' : '↘'}</span>
                      <span>{item.change}</span>
                    </div>
                    <div className={`text-xs sm:text-sm ${
                      item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {item.change.startsWith('+') ? '+' : ''}₹{item.changeValue.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.demand === 'Very High' ? 'bg-red-100 text-red-800' :
                      item.demand === 'High' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.demand}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Demand</div>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Price Trend */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs sm:text-sm text-gray-600">
                <span>Last week: ₹{item.lastWeek.toLocaleString()}</span>
                <span>Updated 2 min ago</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Market Insights */}
        <MarketInsightCard />
      </div>
    </div>
  )
}

export default MarketPrices
