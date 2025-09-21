interface Crop {
  crop: string
  suitability: string
  expectedRevenue: string
}

interface RecommendationsCardProps {
  recommendations: Crop[]
  loading: boolean
}

const RecommendationsCard = ({ recommendations, loading }: RecommendationsCardProps) => {
  return (
    <div className="mt-3 sm:mt-4 w-full bg-white border border-green-200 rounded-xl p-4 sm:p-6">
      <h3 className="text-sm md:text-base font-medium text-green-900 mb-3">AI Crop Suggestions</h3>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          {/* Tailwind spinner */}
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recommendations.map((rec) => (
            <div
              key={rec.crop}
              className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-3 flex items-center justify-between sm:text-center cursor-pointer"
            >
              <div className="text-sm font-medium text-green-900">{rec.crop}</div>
              <div>
                <div className="text-xs text-green-700 mt-1">{rec.suitability} suitability</div>
                <div className="text-right text-sm font-semibold text-green-800 mt-1">
                  {rec.expectedRevenue}
                </div>
              </div>
            </div>
          ))}

          {/* Explain with AI Button */}
          <button className="col-span-1 sm:col-span-3 w-full md:w-auto bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-medium px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base rounded-lg flex items-center gap-2 transition-colors justify-center cursor-pointer">
            Explain With AI Chatbot
          </button>
        </div>
      )}
    </div>
  )
}

export default RecommendationsCard
