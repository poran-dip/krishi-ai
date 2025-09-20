'use client'

import { Lightbulb } from "lucide-react"
import { useState } from "react"
import RecommendationsCard from "./RecommendationsCard"

const AISuggestions = () => {
  const [showRecommendations, setShowRecommendations] = useState(false)

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
              onChange={() => setShowRecommendations(false)}
            >
              <option>All</option>
              <option>Field 1</option>
              <option>Field 2</option>
              <option>Field 3</option>
            </select>

            {/* Action button */}
            <button 
              className="col-span-2 bg-green-600 hover:bg-green-700 text-white text-sm md:text-base font-medium px-2 py-2 sm:px-4 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto cursor-pointer"
              onClick={() => setShowRecommendations(true)}
            >
              Show AI Suggestions
            </button>
          </div>
        </div>

        {showRecommendations &&
          <RecommendationsCard />
        }
      </div>
    </>
  )
}

export default AISuggestions
