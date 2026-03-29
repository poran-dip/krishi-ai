'use client'
import { BarChart3, TrendingUp, Calendar, DollarSign } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Dynamically import Recharts components with no SSR
const LineChart = dynamic(() => import('recharts').then(mod => ({ default: mod.LineChart })), { ssr: false })
const Line = dynamic(() => import('recharts').then(mod => ({ default: mod.Line })), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false })
const BarChart = dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart })), { ssr: false })
const Bar = dynamic(() => import('recharts').then(mod => ({ default: mod.Bar })), { ssr: false })

const Stats = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  const yieldData = [
    { month: 'Jan', yield: 120, revenue: 15000 },
    { month: 'Feb', yield: 135, revenue: 18000 },
    { month: 'Mar', yield: 145, revenue: 21000 },
    { month: 'Apr', yield: 160, revenue: 25000 },
    { month: 'May', yield: 175, revenue: 28000 },
    { month: 'Jun', yield: 190, revenue: 32000 }
  ]

  const cropData = [
    { crop: 'Wheat', yield: 2800, area: 45 },
    { crop: 'Corn', yield: 3200, area: 38 },
    { crop: 'Soybeans', yield: 1900, area: 25 },
    { crop: 'Rice', yield: 2100, area: 32 }
  ]

  const statsCards = [
    {
      title: 'Total Revenue',
      value: '$139,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Average Yield',
      value: '2,500 kg/ha',
      change: '+8.3%',
      trend: 'up',
      icon: BarChart3,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Farm Efficiency',
      value: '87%',
      change: '+5.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: 'Growing Season',
      value: '180 days',
      change: '+3 days',
      trend: 'up',
      icon: Calendar,
      color: 'text-orange-600 bg-orange-50'
    }
  ]

  if(!isClient) return;
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Farm Performance Analytics</h1>
              <p className="text-gray-600">Comprehensive insights into your farming operations</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Yield & Revenue Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="yield" stroke="#3B82F6" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Crop Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cropData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crop" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="yield" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Top Performing Crops</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Corn</span>
                  <span className="text-sm font-medium text-green-600">3,200 kg/ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Wheat</span>
                  <span className="text-sm font-medium text-green-600">2,800 kg/ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rice</span>
                  <span className="text-sm font-medium text-green-600">2,100 kg/ha</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Monthly Highlights</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Best Month</span>
                  <span className="text-sm font-medium text-blue-600">June</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Peak Yield</span>
                  <span className="text-sm font-medium text-blue-600">190 kg/ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Peak Revenue</span>
                  <span className="text-sm font-medium text-blue-600">$32,000</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Areas for Improvement</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Water Usage</span>
                  <span className="text-sm font-medium text-yellow-600">Optimize</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Soil Health</span>
                  <span className="text-sm font-medium text-green-600">Good</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pest Control</span>
                  <span className="text-sm font-medium text-yellow-600">Monitor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats
