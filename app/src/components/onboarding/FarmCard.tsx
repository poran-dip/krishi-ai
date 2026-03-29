import { useState } from "react"

interface FarmData {
  farmSize: number
  farmType: string
  organicCertified: boolean
}

interface FarmCardProps {
  onNext: (data: FarmData) => void
  defaultValues?: Partial<FarmData>
  onDataChange?: (data: FarmData) => void
}

const FarmCard = ({ 
  onNext, 
  defaultValues, 
}: FarmCardProps) => {
  const [farmSize, setFarmSize] = useState(defaultValues?.farmSize || '')
  const [farmType, setFarmType] = useState(defaultValues?.farmType || '')
  const [organic, setOrganic] = useState(defaultValues?.organicCertified || false)

  const farmTypeOptions = [
    { value: 'MIXED', label: 'Mixed Farming' },
    { value: 'CROP_FARMING', label: 'Crop Farming' }, 
    { value: 'ORGANIC', label: 'Organic Farming' },
    { value: 'GREENHOUSE', label: 'Greenhouse Farming' }
  ]

  const handleFarmSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty string or valid numbers
    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setFarmSize(value)
    }
  }

  const handleFarmSizeFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Clear the field if it's 0 when focused
    if (e.target.value === '0') {
      setFarmSize('')
    }
  }

  const handleFarmSizeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // If field is empty on blur, set to empty (not 0)
    if (e.target.value === '') {
      setFarmSize('')
    }
  }

  const handleSubmit = () => {
    if (!farmSize || farmSize === '0' || !farmType) {
      alert('Please fill in all required fields')
      return
    }

    onNext({
      farmSize: Number(farmSize),
      farmType,
      organicCertified: organic
    })
  }

  return (
    <div className={"p-6 bg-white rounded-lg shadow-md flex flex-col gap-4 max-w-md"}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
          2
        </div>
        <h2 className="text-lg font-semibold">Farm Details</h2>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Farm Size (acres) <span className="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          placeholder="Enter farm size in acres" 
          value={farmSize} 
          onChange={handleFarmSizeChange}
          onFocus={handleFarmSizeFocus}
          onBlur={handleFarmSizeBlur}
          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Farm Type <span className="text-red-500">*</span>
        </label>
        <select 
          value={farmType} 
          onChange={(e) => setFarmType(e.target.value)} 
          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Select farm type</option>
          {farmTypeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="organic"
          checked={organic} 
          onChange={(e) => setOrganic(e.target.checked)}
          className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
        />
        <label htmlFor="organic" className="text-sm text-gray-700">
          Organic Certified
        </label>
      </div>

      
      <button 
        onClick={handleSubmit}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors mt-4"
      >
        Next →
      </button>
    </div>
  )
}

export default FarmCard
