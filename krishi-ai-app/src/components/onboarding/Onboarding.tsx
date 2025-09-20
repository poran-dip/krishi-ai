import { useState, useEffect, useCallback } from "react"
import CropAndRevenueCard from "@/components/onboarding/CropAndRevenueCard"
import FarmCard from "@/components/onboarding/FarmCard"
import LocationCard from "@/components/onboarding/LocationCard"
import { authUtils } from "@/lib/auth"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Crop {
  id: string
  name: string
}

interface OnboardingData {
  // step 0: location
  latitude?: number | null
  longitude?: number | null
  city?: string
  state?: string

  // step 1: farm
  farmSize?: number
  farmType?: string
  organicCertified?: boolean

  // step 2: crops & revenue
  crops?: Crop[]
  futureCrops?: Crop[]
  revenue?: number
  phone?: string
}

interface OnboardingProps {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
  onComplete: () => void
}

export default function Onboarding({ user, onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({})
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false])

  const totalSteps = 3

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setCurrentStep(prev => {
        if (e.key === 'ArrowLeft' && prev > 0) {
          return prev - 1
        } else if (e.key === 'ArrowRight' && prev < totalSteps - 1) {
          return prev + 1
        }
        return prev
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const updateData = useCallback((stepIndex: number, stepData: Partial<OnboardingData>) => {
    setData((prev: OnboardingData) => ({ ...prev, ...stepData }))
    
    // Mark step as completed if it has required data
    setCompletedSteps(prev => {
      const newCompletedSteps = [...prev]
      if (stepIndex === 0) {
        newCompletedSteps[0] = !!(stepData.city && stepData.state)
      } else if (stepIndex === 1) {
        newCompletedSteps[1] = !!(stepData.farmSize && stepData.farmType)
      } else if (stepIndex === 2) {
        newCompletedSteps[2] = !!(stepData.crops && stepData.crops?.length > 0 && stepData.phone)
      }
      return newCompletedSteps
    })
  }, [])

  const nextStep = (stepData: Partial<OnboardingData>) => {
    updateData(currentStep, stepData)
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const finishOnboarding = async (finalData: Partial<OnboardingData>) => {
    const allData = { ...data, ...finalData }
    
    const payload = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: allData.phone || "+91 9876543210",
      settings: {
        languagePreference: "en",
        city: allData.city,
        state: allData.state,
        farmSize: allData.farmSize,
        farmType: allData.farmType,
        organicCertified: allData.organicCertified ?? false,
        latitude: allData.latitude,
        longitude: allData.longitude,
      },
      crops: allData.crops || [],
      futureCrops: allData.futureCrops || [],
      revenue: allData.revenue || 0,
    }

    try {
      const response = await fetch("/api/v1/protected/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authUtils.getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) {
        console.error('Failed to save profile:', await response.text())
        return
      }
      
      onComplete()
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  const canGoToStep = (stepIndex: number) => {
    // Can always go to step 0
    if (stepIndex === 0) return true
    
    // Can go to step 1 if step 0 is completed
    if (stepIndex === 1) return completedSteps[0]
    
    // Can go to step 2 if steps 0 and 1 are completed
    if (stepIndex === 2) return completedSteps[0] && completedSteps[1]
    
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to KrishiAI, {user.firstName}!
          </h1>
          <p className="text-gray-600">
            Let&apos;s set up your farming profile to get personalized insights
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[0, 1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <button
                  onClick={() => canGoToStep(step) && setCurrentStep(step)}
                  disabled={!canGoToStep(step)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep === step
                      ? 'bg-green-500 text-white'
                      : completedSteps[step]
                      ? 'bg-green-600 text-white'
                      : canGoToStep(step)
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {completedSteps[step] ? '✓' : step + 1}
                </button>
                {step < 2 && (
                  <div className={`w-16 h-1 mx-2 ${
                    completedSteps[step] ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current card container */}
        <div className="flex justify-center mb-8">
          {currentStep === 0 && (
            <LocationCard
              onNext={nextStep}
              
              onDataChange={(stepData) => updateData(0, stepData)}
              defaultValues={data}
            />
          )}
          
          {currentStep === 1 && (
            <FarmCard
              onNext={nextStep}
              defaultValues={data}
              onDataChange={(stepData) => updateData(1, stepData)}
            />
          )}
          
          {currentStep === 2 && (
            <CropAndRevenueCard
              onFinish={finishOnboarding}
              defaultValues={data}
              onDataChange={(stepData) => updateData(2, stepData)}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {totalSteps}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Use ← → keys
            </div>
          </div>

          <button
            onClick={() => {
              if (currentStep === totalSteps - 1) {
                // If on last step, try to finish
                const currentCard = document.querySelector('[data-finish-button]') as HTMLButtonElement
                if (currentCard && !currentCard.disabled) {
                  currentCard.click()
                }
              } else {
                setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))
              }
            }}
            disabled={currentStep < totalSteps - 1 && !completedSteps[currentStep]}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Completion status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow">
            <div className="flex gap-2">
              {completedSteps.map((completed, index) => (
                <div key={index} className={`w-3 h-3 rounded-full ${
                  completed ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {completedSteps.filter(Boolean).length} of {totalSteps} steps completed
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
