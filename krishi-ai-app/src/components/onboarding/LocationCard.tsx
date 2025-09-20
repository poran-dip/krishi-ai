import { useState, useEffect } from 'react'

interface LocationData {
  latitude: number | null
  longitude: number | null
  city: string
  state: string
}

interface LocationCardProps {
  onNext: (data: LocationData) => void
  onDataChange?: (data: LocationData) => void
  defaultValues?: Partial<LocationData>
}

const LocationCard = ({ 
  onNext, 
  onDataChange,
  defaultValues
}: LocationCardProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [manualEntry, setManualEntry] = useState(false)
  const [city, setCity] = useState(defaultValues?.city || '')
  const [state, setState] = useState(defaultValues?.state || '')
  const [hasLocation, setHasLocation] = useState(false)

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ]

  // Check if we already have location data
  useEffect(() => {
    if (defaultValues?.city && defaultValues?.state) {
      setCity(defaultValues.city)
      setState(defaultValues.state)
      setHasLocation(true)
      setManualEntry(true)
    }
  }, [defaultValues])

  const handleUseLocation = () => {
    setLoading(true)
    setError('')
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          // Try to reverse geocode to get city/state
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`
          )
          const data = await response.json()
          
          const locationData = {
            latitude: pos.coords.latitude, 
            longitude: pos.coords.longitude,
            city: data.city || data.locality || 'Unknown',
            state: data.principalSubdivision || 'Unknown'
          }
          
          setCity(locationData.city)
          setState(locationData.state)
          setHasLocation(true)
          setLoading(false)
          
          if (onDataChange) {
            onDataChange(locationData)
          }
        } catch (err) {
          setLoading(false)
          // If geocoding fails, still use coordinates
          const locationData = {
            latitude: pos.coords.latitude, 
            longitude: pos.coords.longitude,
            city: 'Unknown',
            state: 'Unknown'
          }
          
          setCity('Unknown')
          setState('Unknown')
          setHasLocation(true)
          
          if (onDataChange) {
            onDataChange(locationData)
          }
        }
      },
      (_err) => {
        setLoading(false)
        setError('Unable to get location. Please enter manually.')
        setManualEntry(true)
      }
    )
  }

  const handleManualSubmit = () => {
    if (!city || !state) {
      setError('Please enter both city and state')
      return
    }
    
    const locationData = {
      latitude: null,
      longitude: null,
      city,
      state
    }
    
    setHasLocation(true)
    onNext(locationData)
  }

  const resetLocation = () => {
    setManualEntry(false)
    setHasLocation(false)
    setCity('')
    setState('')
    setError('')
  }

  if (hasLocation) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md flex flex-col gap-4 max-w-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
            1
          </div>
          <h2 className="text-lg font-semibold">Your Location</h2>
        </div>
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-700 font-medium">{city}, {state}</p>
          <p className="text-green-600 text-sm">✓ Location confirmed</p>
        </div>
      </div>
    )
  }

  if (manualEntry || hasLocation) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md flex flex-col gap-4 max-w-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
            1
          </div>
          <h2 className="text-lg font-semibold">Your Location</h2>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter your city" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select 
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select your state</option>
            {indianStates.map(stateName => (
              <option key={stateName} value={stateName}>{stateName}</option>
            ))}
          </select>
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="flex gap-2">
          <button 
            onClick={handleManualSubmit}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Next →
          </button>
          <button 
            onClick={resetLocation}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            GPS
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md flex flex-col gap-4 max-w-md">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
          1
        </div>
        <h2 className="text-lg font-semibold">Your Location</h2>
      </div>
      
      <p className="text-gray-600">We&apos;ll use your location to provide relevant farming insights and weather data.</p>
      
      <button 
        onClick={handleUseLocation}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        {loading ? 'Getting location...' : 'Use my current location'}
      </button>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      

      <button 
        onClick={() => setManualEntry(true)}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
      >
        Enter location manually
      </button>
    </div>
  )
}

export default LocationCard
