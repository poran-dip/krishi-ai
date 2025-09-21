// app/api/v1/protected/ai/recommend-crop/route.ts
import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"

interface Crop {
  crop: string
  suitability: string
  expectedRevenue: string
}

const mockCrops = ["Wheat", "Rice", "Maize", "Soybean", "Pulses", "Cotton", "Barley"]

function getRandomCrops(count = 3): Crop[] {
  const shuffled = mockCrops.sort(() => 0.5 - Math.random()).slice(0, count)

  return shuffled.map((crop) => ({
    crop,
    suitability: ["Very High", "High", "Medium"][Math.floor(Math.random() * 3)],
    expectedRevenue: `₹${Math.floor(Math.random() * 30) + 10}k`,
  }))
}

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const { criteria } = await req.json()

    // TODO: later call actual AI model with soil/weather/market/rotation
    const recommendations = getRandomCrops(3)

    return NextResponse.json({
      criteria,
      recommendations,
      meta: {
        explanation: `Recommended crops based on ${criteria}`,
      },
    })
  } catch (err) {
    console.error("Recommend Crop API error:", err)
    return NextResponse.json(
      { error: "Failed to get crop recommendations" },
      { status: 500 }
    )
  }
})
