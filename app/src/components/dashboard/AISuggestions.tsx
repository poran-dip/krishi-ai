'use client'

import { Lightbulb } from "lucide-react"
import { useState } from "react"
import { authUtils } from "@/lib/auth"
import RecommendationsCard from "./RecommendationsCard"
import { WeatherData } from "@/services/weatherService"
import { Prisma } from "@/generated/prisma"

type Farmer = Prisma.FarmerGetPayload<{
  include: {
    crops: true;
    settings: true;
  }
}>

interface Crop {
  crop: string
  suitability: string
  expectedRevenue: string
}

interface AISuggestionsProps {
  weatherData: WeatherData | null
  soilData: {
    nitrogen: number | string;
    phosphorus: number | string;
    potassium: number | string;
    ph: number | string;
    organicMatter: number | string;
  }
  farmerData: Farmer | null
}

const AISuggestions = ({ weatherData, soilData, farmerData }: AISuggestionsProps) => {
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [criteria, setCriteria] = useState("all")
  const [recommendations, setRecommendations] = useState<Crop[]>([])
  const [loading, setLoading] = useState(false)

  async function fetchRecommendations() {
    try {
      setLoading(true)
      const token = authUtils.getToken()

      const res = await fetch("/api/v1/protected/ai/recommend-crop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          criteria,
          weatherData,
          soilData,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to fetch recommendations")
      }

      const data = await res.json()

      // Since API now returns full Crop objects, use them directly
      setRecommendations(data.recommendations)
      setShowRecommendations(true)
    } catch (e) {
      console.error("Error fetching AI recs", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        {/* Next Crop Suggestions Card */}
        <div className="w-full bg-green-50 border border-green-200 rounded-xl px-3 sm:px-4 py-3 sm:py-4 flex flex-col md:flex-row sm:items-center justify-between gap-4">
          {/* Left: Icon + Heading + Helper */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightbulb className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-medium text-green-900">Get AI Recommendations For Your Next Crop</h2>
              <p className="hidden md:block text-sm text-green-700 mt-1">
                Select a field to see which crop would thrive next
              </p>
            </div>
          </div>

          {/* Right: Dropdown + Button */}
          <div className="grid grid-cols-3 sm:flex sm:flex-row items-center gap-2 sm:gap-3 w-full md:w-auto">
            {/* Field dropdown */}
            <select
              className="col-span-1 border border-green-200 rounded-lg p-2 text-sm sm:text-base text-green-900 bg-white w-full md:w-auto"
              value={criteria}
              onChange={(e) => {
                setCriteria(e.target.value)
                setShowRecommendations(false)
              }}
            >
              <option value="soil">Based on Soil</option>
              <option value="weather">Based on Weather</option>
              <option value="rotation">Based on Crop Rotation</option>
              <option value="market">Based on Market Demand</option>
              <option value="sustainability">Based on Sustainability</option>
              <option value="all">Overall Recommendation</option>
            </select>

            {/* Action button */}
            <button 
              className="col-span-2 bg-green-600 hover:bg-green-700 text-white text-sm md:text-base font-medium px-2 py-2 sm:px-4 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto cursor-pointer"
              onClick={fetchRecommendations}
            >
              Show AI Suggestions
            </button>
          </div>
        </div>

        {showRecommendations && (
          <RecommendationsCard recommendations={recommendations} soilData={soilData} weatherData={weatherData} farmerData={farmerData} loading={loading} />
        )}
      </div>
    </>
  )
}

export default AISuggestions
