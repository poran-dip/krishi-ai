'use client'

import { useEffect, useState } from "react"
import { authUtils } from "@/lib/auth"
import { Prisma } from "@/generated/prisma"
import { WeatherData, WeatherAlert, ForecastDay } from '@/services/weatherService'
import { SoilDataService } from '@/services/soilDataService'
import { fetchWithTimeout } from "@/utils/fetchWithTimer"

import Navbar from "@/components/dashboard/Navbar"
import AISuggestions from "./AISuggestions"
import MarketPrices from "./MarketPrices"
import MainCards from "./MainCards"
import QuickActions from "./QuickActions"
import Footer from "./Footer"

// Types
type Farmer = Prisma.FarmerGetPayload<{
  include: {
    crops: true;
    settings: true;
  }
}>

interface DashboardProps {
  user: { 
    name: string; 
    email: string 
  }
}

const Dashboard = ({ user }: DashboardProps) => {
  // Farmer data state
  const [farmerData, setFarmerData] = useState<Farmer | null>(null)
  const [farmerLoading, setFarmerLoading] = useState(true)

  // Weather data state
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([])
  const [weeklyForecast, setWeeklyForecast] = useState<ForecastDay[]>([])
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)

  // Soil data state
  const [soilData, setSoilData] = useState<{
    nitrogen: number | string;
    phosphorus: number | string;
    potassium: number | string;
    ph: number | string;
    organicMatter: number | string;
  }>({
    nitrogen: "-",
    phosphorus: "-",
    potassium: "-",
    ph: "-",
    organicMatter: "-"
  })
  const [soilDataLoading, setSoilDataLoading] = useState(false)
  const [soilDataError, setSoilDataError] = useState<string | null>(null)

  // Fetch farmer data
  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const token = authUtils.getToken()
        const response = await fetch('/api/v1/protected/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const result = await response.json()
          setFarmerData(result.data)
        }
      } catch (error) {
        console.error('Error fetching farmer data:', error)
      } finally {
        setFarmerLoading(false)
      }
    }

    fetchFarmerData()
  }, [])

  // Fetch weather data when farmer data is available
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!farmerData?.settings) return
      
      setWeatherLoading(true)
      setWeatherError(null)
      
      try {
        const token = authUtils.getToken()
        
        // Build query parameters based on available location data
        const params = new URLSearchParams()
        
        if (farmerData.settings.latitude && farmerData.settings.longitude) {
          params.append('lat', farmerData.settings.latitude.toString())
          params.append('lon', farmerData.settings.longitude.toString())
        } else if (farmerData.settings.city && farmerData.settings.state) {
          params.append('city', farmerData.settings.city)
          params.append('state', farmerData.settings.state)
          if (farmerData.settings.country) {
            params.append('country', farmerData.settings.country)
          }
        }
        
        const response = await fetch(`/api/v1/protected/weather?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data')
        }
        
        const result = await response.json()
        
        if (result.success) {
          setWeatherData(result.data.current)
          setWeeklyForecast(result.data.weeklyForecast)
          setWeatherAlerts(result.data.alerts)
        } else {
          throw new Error(result.error || 'Weather API returned error')
        }
        
      } catch (error) {
        console.error('Weather fetch error:', error)
        setWeatherError('Failed to fetch weather data')
      } finally {
        setWeatherLoading(false)
      }
    }
    
    if (farmerData && !farmerLoading) {
      fetchWeatherData()
    }
  }, [farmerData, farmerLoading])

  // Fetch soil data when farmer data is available
  useEffect(() => {
    const fetchSoilData = async () => {
      if (!farmerData?.settings) return
      
      setSoilDataLoading(true)
      setSoilDataError(null)
      
      try {
        let realSoilData
        
        // Priority 1: Use stored lat/lon
        if (farmerData.settings.latitude && farmerData.settings.longitude) {
          console.log('Fetching soil data using stored coordinates')
          realSoilData = await fetchWithTimeout(
            SoilDataService.fetchSoilData(
              farmerData.settings.latitude, 
              farmerData.settings.longitude
            )
          )
        }
        // Priority 2: Use city/state for geocoding
        else if (farmerData.settings.city && farmerData.settings.state) {
          console.log('Fetching soil data using city/state geocoding')
          realSoilData = await fetchWithTimeout(
            SoilDataService.getSoilDataFromLocation(
              farmerData.settings.city,
              farmerData.settings.state,
              farmerData.settings.country
            )
          )
        }
        // Priority 3: Try current location
        else {
          console.log('Attempting to get current location for soil data')
          realSoilData = await fetchWithTimeout(
            SoilDataService.getCurrentLocationSoilData()
          )
        }
        
        if (realSoilData) {
          setSoilData(realSoilData)
          console.log('Real soil data fetched:', realSoilData)
        }
        
      } catch (error) {
        console.error('Failed to fetch real soil data:', error)
        setSoilDataError(error instanceof Error ? error.message : 'Failed to fetch soil data')
        
        // Keep mock data as fallback
        console.log('Using mock soil data as fallback')
      } finally {
        setSoilDataLoading(false)
      }
    }
    
    if (farmerData && !farmerLoading) {
      fetchSoilData()
    }
  }, [farmerData, farmerLoading])

  const firstName = user.name.split(' ')[0]
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <div className="flex flex-col w-full mx-auto space-y-4 sm:space-y-6">
      <Navbar 
        farmerData={farmerData}
        isLoading={farmerLoading}
      />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Greeting Section */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">{getGreeting()}, {firstName}!</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Here&apos;s what&apos;s happening on your farm today</p>
        </div>
        
        {/* Quick Actions Row */}
        <QuickActions />

        {/* AI Suggestions Button */}
        <AISuggestions 
          weatherData={weatherData}
          soilData={soilData}
          farmerData={farmerData}
        />

        {/* Farm and Weather Cards */}
        <MainCards 
          farmerData={farmerData}
          farmerLoading={farmerLoading}
          weatherData={weatherData}
          weatherLoading={weatherLoading}
          weatherError={weatherError}
          weatherAlerts={weatherAlerts}
          weeklyForecast={weeklyForecast}
          soilData={soilData}
          soilDataLoading={soilDataLoading}
          soilDataError={soilDataError}
        />

        {/* Market Prices */}
        <MarketPrices 
          farmerData={farmerData}
          loading={farmerLoading}
        />
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard
