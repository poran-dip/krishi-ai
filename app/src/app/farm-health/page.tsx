import { Layers2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'

const FarmHealth = () => {
  const healthMetrics = [
    {
      id: 1,
      title: 'Soil pH Level',
      value: '6.8',
      status: 'good',
      trend: 'up',
      description: 'Optimal range for most crops'
    },
    {
      id: 2,
      title: 'Moisture Content',
      value: '45%',
      status: 'warning',
      trend: 'down',
      description: 'Below recommended levels'
    },
    {
      id: 3,
      title: 'Nutrient Level',
      value: '78%',
      status: 'good',
      trend: 'up',
      description: 'Rich in nitrogen and phosphorus'
    },
    {
      id: 4,
      title: 'Crop Health Score',
      value: '85%',
      status: 'good',
      trend: 'up',
      description: 'Strong growth indicators'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'danger': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-5 h-5" />
      case 'warning': return <AlertTriangle className="w-5 h-5" />
      case 'danger': return <AlertTriangle className="w-5 h-5" />
      default: return <CheckCircle className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Layers2 className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Farm Health Monitor</h1>
              <p className="text-gray-600">Real-time monitoring of soil quality and crop status</p>
            </div>
          </div>
        </div>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {healthMetrics.map((metric) => (
            <div
              key={metric.id}
              className={`p-6 rounded-lg border ${getStatusColor(metric.status)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  <h3 className="font-medium">{metric.title}</h3>
                </div>
                <div className="flex items-center">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>
              <div className="text-2xl font-bold mb-2">{metric.value}</div>
              <p className="text-sm opacity-80">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Soil Analysis</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Nitrogen (N)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <span className="text-sm font-medium">75%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phosphorus (P)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '82%'}}></div>
                  </div>
                  <span className="text-sm font-medium">82%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Potassium (K)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                  <span className="text-sm font-medium">60%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Consider irrigation - moisture levels are below optimal range</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Soil pH is excellent for current crop rotation</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Potassium supplementation recommended for next season</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FarmHealth
