import { useRouter } from "next/navigation"
import { BarChart3, Layers2, MessageCircle } from "lucide-react"

const QuickActions = () => {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      <button 
        className="flex-1 flex flex-col sm:flex-row items-center gap-2 md:gap-3 p-2 md:p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 cursor-pointer"
        onClick={() => handleNavigation('/ask-ai')}
      >
        <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <MessageCircle className="text-white w-5 h-5" />
        </div>
        <div className="text-center md:text-left">
          <div className="text-xs sm:text-sm md:text-base font-medium text-blue-900">Ask AI</div>
          <div className="hidden md:block text-sm text-blue-700">Get personalized farming advice</div>
        </div>
      </button>
      <button 
        className="flex-1 flex flex-col sm:flex-row items-center gap-2 md:gap-3 p-2 md:p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200 cursor-pointer"
        onClick={() => handleNavigation('/farm-health')}
      >
        <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Layers2 className="text-white w-5 h-5" />
        </div>
        <div className="text-center md:text-left">
          <div className="text-xs sm:text-sm md:text-base font-medium text-indigo-900">Farm Health</div>
          <div className="hidden md:block text-sm text-indigo-700">Monitor soil quality &amp; crop status</div>
        </div>
      </button>
      <button 
        className="flex-1 flex flex-col sm:flex-row items-center gap-2 md:gap-3 p-2 md:p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors border border-yellow-200 cursor-pointer"
        onClick={() => handleNavigation('/stats')}
      >
        <div className="flex-shrink-0 w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
          <BarChart3 className="text-white w-5 h-5" />
        </div>
        <div className="text-center md:text-left">
          <div className="text-xs sm:text-sm md:text-base font-medium text-yellow-900">View Stats</div>
          <div className="hidden md:block text-sm text-yellow-700">Analyze farm performance</div>
        </div>
      </button>
    </div>
  )
}

export default QuickActions
