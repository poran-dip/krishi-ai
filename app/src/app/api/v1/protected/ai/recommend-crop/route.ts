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
  const available = [...mockCrops]
  const result: Crop[] = []

  for (let i = 0; i < count && available.length > 0; i++) {
    const idx = Math.floor(Math.random() * available.length)
    const crop = available.splice(idx, 1)[0]
    result.push({
      crop,
      suitability: ["Very High", "High", "Medium"][Math.floor(Math.random() * 3)],
      expectedRevenue: `₹${Math.floor(Math.random() * 30) + 10}k`,
    })
  }

  return result
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
