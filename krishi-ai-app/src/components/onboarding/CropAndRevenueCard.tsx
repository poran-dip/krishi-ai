import { useState, useRef } from "react"

interface Crop {
  id: string;
  name: string;
}

interface CropAndRevenueData {
  crops: Crop[];
  futureCrops: Crop[];
  revenue: number;
  phone: string;
}

interface CropAndRevenueCardProps {
  onFinish: (data: CropAndRevenueData) => void;
  defaultValues?: Partial<CropAndRevenueData>;
  onDataChange?: (data: CropAndRevenueData) => void;
}

const CropAndRevenueCard = ({ 
  onFinish, 
  defaultValues,
}: CropAndRevenueCardProps) => {
  const [crops, setCrops] = useState<Crop[]>(defaultValues?.crops || [])
  const [futureCrops, setFutureCrops] = useState<Crop[]>(defaultValues?.futureCrops || [])
  const [revenue, setRevenue] = useState(defaultValues?.revenue || '')
  const [phone, setPhone] = useState(defaultValues?.phone || '')
  const [currentCropInput, setCurrentCropInput] = useState('')
  const [futureCropInput, setFutureCropInput] = useState('')

  const currentCropInputRef = useRef<HTMLInputElement>(null)
  const futureCropInputRef = useRef<HTMLInputElement>(null)

  // Common crop suggestions
  const cropSuggestions = [
    'Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Jute', 'Tea', 'Coffee',
    'Coconut', 'Groundnut', 'Mustard', 'Sesame', 'Castor', 'Sunflower',
    'Potato', 'Onion', 'Tomato', 'Brinjal', 'Cabbage', 'Cauliflower',
    'Okra', 'Cucumber', 'Bitter Gourd', 'Bottle Gourd', 'Pumpkin',
    'Mango', 'Apple', 'Orange', 'Banana', 'Grapes', 'Pomegranate',
    'Turmeric', 'Ginger', 'Garlic', 'Coriander', 'Cumin', 'Fenugreek',
    'Chickpea', 'Black Gram', 'Green Gram', 'Red Gram', 'Lentil'
  ]

  const processInput = (input: string): string[] => {
    // Split by comma, semicolon, or newline, then trim and filter empty strings
    return input
      .split(/[,;\n]/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
  }

  const addCrops = (input: string, existingCrops: Crop[], setCropList: (crops: Crop[]) => void) => {
    const newCropNames = processInput(input)
    if (newCropNames.length === 0) return

    const newCrops: Crop[] = newCropNames.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    }))

    // Filter out duplicates
    const existingNames = existingCrops.map(crop => crop.name.toLowerCase())
    const uniqueNewCrops = newCrops.filter(crop => 
      !existingNames.includes(crop.name.toLowerCase())
    )

    if (uniqueNewCrops.length > 0) {
      setCropList([...existingCrops, ...uniqueNewCrops])
    }
  }

  const handleCurrentCropInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCurrentCropInput(value)

    // Auto-add when comma is typed
    if (value.includes(',') || value.includes(';')) {
      addCrops(value, crops, setCrops)
      setCurrentCropInput('')
    }
  }

  const handleFutureCropInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFutureCropInput(value)

    // Auto-add when comma is typed
    if (value.includes(',') || value.includes(';')) {
      addCrops(value, futureCrops, setFutureCrops)
      setFutureCropInput('')
    }
  }

  const handleCurrentCropKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentCropInput.trim()) {
      addCrops(currentCropInput, crops, setCrops)
      setCurrentCropInput('')
    }
  }

  const handleFutureCropKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && futureCropInput.trim()) {
      addCrops(futureCropInput, futureCrops, setFutureCrops)
      setFutureCropInput('')
    }
  }

  const removeCrop = (index: number, list: Crop[], setList: (crops: Crop[]) => void) => {
    setList(list.filter((_, i: number) => i !== index))
  }

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty string or valid numbers
    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setRevenue(value)
    }
  }

  const handleRevenueFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Clear the field if it's 0 when focused
    if (e.target.value === '0') {
      setRevenue('')
    }
  }

  const handleRevenueBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // If field is empty on blur, leave it empty
    if (e.target.value === '') {
      setRevenue('')
    }
  }

  const addSuggestedCrop = (cropName: string, isFuture: boolean = false) => {
    const targetList = isFuture ? futureCrops : crops
    const setTargetList = isFuture ? setFutureCrops : setCrops
    
    const existingNames = targetList.map((crop: Crop) => crop.name.toLowerCase())
    if (!existingNames.includes(cropName.toLowerCase())) {
      const newCrop: Crop = {
        id: Math.random().toString(36).substr(2, 9),
        name: cropName
      }
      setTargetList([...targetList, newCrop])
    }
  }

  const handleFinish = () => {
    // Add any remaining input
    if (currentCropInput.trim()) {
      addCrops(currentCropInput, crops, setCrops)
      setCurrentCropInput('')
    }
    if (futureCropInput.trim()) {
      addCrops(futureCropInput, futureCrops, setFutureCrops)
      setFutureCropInput('')
    }

    const finalData = {
      crops,
      futureCrops,
      revenue: revenue === '' ? 0 : Number(revenue),
      phone: phone || "+91 9876543210",
      ...defaultValues
    }
    
    onFinish(finalData)
  }

  return (
    <div className={"p-6 bg-white rounded-lg shadow-md flex flex-col gap-4 max-w-md"}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
          3
        </div>
        <h2 className="text-lg font-semibold">Crops & Revenue</h2>
      </div>
      
      {/* Phone number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input 
          type="tel" 
          placeholder="Enter your phone number" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Current crops */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current crops <span className="text-red-500">*</span>
        </label>
        <input 
          ref={currentCropInputRef}
          type="text" 
          placeholder="Type crops separated by commas (Rice, Wheat, Maize)" 
          value={currentCropInput}
          onChange={handleCurrentCropInput}
          onKeyDown={handleCurrentCropKeyDown}
          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: Separate multiple crops with commas or press Enter
        </p>
        
        {/* Current crop tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {crops.map((crop: Crop, i: number) => (
            <span 
              key={crop.id} 
              className="bg-green-100 px-2 py-1 rounded flex items-center gap-1 text-sm"
            >
              {crop.name}
              <button 
                onClick={() => removeCrop(i, crops, setCrops)}
                className="text-red-500 hover:text-red-700 ml-1 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Crop suggestions */}
        {crops.length < 3 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Popular crops:</p>
            <div className="flex flex-wrap gap-1">
              {cropSuggestions.slice(0, 8).map(crop => (
                <button
                  key={crop}
                  onClick={() => addSuggestedCrop(crop)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600"
                  type="button"
                >
                  + {crop}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Future crops */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Future crops (optional)
        </label>
        <input 
          ref={futureCropInputRef}
          type="text" 
          placeholder="Crops you plan to grow" 
          value={futureCropInput}
          onChange={handleFutureCropInput}
          onKeyDown={handleFutureCropKeyDown}
          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        
        {/* Future crop tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {futureCrops.map((crop: Crop, i: number) => (
            <span 
              key={crop.id} 
              className="bg-blue-100 px-2 py-1 rounded flex items-center gap-1 text-sm"
            >
              {crop.name}
              <button 
                onClick={() => removeCrop(i, futureCrops, setFutureCrops)}
                className="text-red-500 hover:text-red-700 ml-1 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Revenue */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Annual revenue (₹)
        </label>
        <input 
          type="text" 
          placeholder="Enter annual revenue in rupees" 
          value={revenue} 
          onChange={handleRevenueChange}
          onFocus={handleRevenueFocus}
          onBlur={handleRevenueBlur}
          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <button 
        onClick={handleFinish}
        disabled={crops.length === 0 || !phone}
        data-finish-button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mt-4"
      >
        Complete Setup
      </button>
    </div>
  )
}

export default CropAndRevenueCard
