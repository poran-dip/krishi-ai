'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  Settings, 
  MapPin, 
  LogOut, 
  Edit3, 
  Crop,
  Phone,
  Calendar,
  Award,
  Bell,
  HelpCircle,
  ChevronRight,
  User
} from 'lucide-react';
import { Prisma } from '@/generated/prisma';

type Farmer = Prisma.FarmerGetPayload<{
  include: {
    crops: true;
    settings: true;
  }
}>

interface ProfilePaneProps {
  farmerData: Farmer | null
  isLoading: boolean
  onClose: () => void
}

const ProfilePane = ({ farmerData, isLoading, onClose }: ProfilePaneProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const paneRef = useRef<HTMLDivElement | null>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' }
  ];

  const farmTypeMap: Record<string, string> = {
    CROP_FARMING: "Crop Farming",
    MIXED: "Mixed Farm",
    ORGANIC: "Organic Farm",
    GREENHOUSE: "Greenhouse",
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paneRef.current && event.target instanceof Element && !paneRef.current.contains(event.target)) {
        // Check if the click is on the profile button - don't close if it is
        const profileButton = event.target.closest('[data-profile-button]');
        if (!profileButton) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleLogoutClick = async () => {
    try {
      onClose(); // close the pane immediately

      const res = await fetch('/api/v1/auth/signout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!res.ok) {
        console.error('Sign out failed:', await res.text());
        return;
      }
      sessionStorage.removeItem('token')
      localStorage.removeItem('token')
      
      // redirect to homepage after logout
      window.location.href = '/';
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const timeAgo = (lastSync: Date | string) => {
    if (!lastSync) return 'Never'

    const syncDate = lastSync instanceof Date ? lastSync : new Date(lastSync)
    const now = new Date()
    let diffMs = now.getTime() - syncDate.getTime()

    if (diffMs < 0) diffMs = 0 // future timestamps → treat as just now

    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 5) return 'Active' // last 5 minutes → Active
    if (diffMins < 60) return `${diffMins} m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} h ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} d ago`
  }

  if (isLoading || !farmerData) {
    return (
      <>
        {/* Mobile backdrop blur */}
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden" />

        {/* Profile Pane */}
        <div
          ref={paneRef}
          className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200
                    md:absolute md:right-4 md:top-20 md:w-96
                    inset-4 md:inset-auto
                    max-h-[90vh] overflow-y-auto"
        >
          {/* Header - Real elements */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Account</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Profile Info Skeleton */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Farm Stats Skeleton */}
          <div className="p-4 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Content Blocks Skeleton */}
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            <div className="space-y-2">
              <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile backdrop blur */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden" />
      
      {/* Profile Pane */}
      <div 
        ref={paneRef}
        className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200
                   md:absolute md:right-4 md:top-20 md:w-96
                   inset-4 md:inset-auto
                   max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Account</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-green-600">
              {farmerData.avatar ? (
                <Image 
                  src={farmerData.avatar} 
                  alt={farmerData.name} 
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={24} className="text-white" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{farmerData.name}</h3>
              <p className="text-sm text-gray-600">{farmerData.email}</p>
              {farmerData.settings?.city && farmerData.settings.state && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin size={12} />
                  {farmerData.settings.city}, {farmerData.settings.state}
                </p>
              )}
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Edit3 size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Farm Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                true ? 'bg-green-500' : false ? 'bg-red-500' : 'bg-gray-400'
              }`} />
              <div>
                <p className="text-gray-500">Last Sync</p>
                <p className="font-medium">{timeAgo(farmerData.lastSync)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Crop size={16} className="text-green-600" />
              <div>
                <p className="text-gray-500">Land Area</p>
                <p className="font-medium">{farmerData.settings?.farmSize ?? 0} acres</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-600" />
              <div>
                <p className="text-gray-500">Farm Type</p>
                <p className="font-medium">{farmTypeMap[farmerData.settings?.farmType ?? ""] ?? "Unknown"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award size={16} className="text-blue-600" />
              <div>
                <p className="text-gray-500">Organic Certified</p>
                <p className="font-medium">{farmerData.settings?.organicCertified ? "Yes" : "No"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-orange-600" />
              <div>
                <p className="text-gray-500">Mobile</p>
                <p className="font-medium">{farmerData.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-purple-600" />
              <div>
                <p className="text-gray-500">Member Since</p>
                <p className="font-medium">Jan 2023</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Crops */}
        <div className="p-4 border-b border-gray-100">
          <h4 className="font-medium text-gray-900 mb-3">Current Crops</h4>
          <div className="flex flex-wrap gap-2">
            {farmerData.crops.map((crop) => (
              <span 
                key={crop.id}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
              >
                {crop.name}
              </span>
            ))}
          </div>
        </div>

        {/* Language Selector */}
        <div className="p-4 border-b border-gray-100">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.name}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Actions */}
        <div className="p-4">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <Settings size={18} className="text-gray-500" />
              <span className="text-sm text-gray-700">Account Settings</span>
              <ChevronRight size={16} className="text-gray-400 ml-auto" />
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <Bell size={18} className="text-gray-500" />
              <span className="text-sm text-gray-700">Notification Preferences</span>
              <ChevronRight size={16} className="text-gray-400 ml-auto" />
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <MapPin size={18} className="text-gray-500" />
              <span className="text-sm text-gray-700">Location Settings</span>
              <ChevronRight size={16} className="text-gray-400 ml-auto" />
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <HelpCircle size={18} className="text-gray-500" />
              <span className="text-sm text-gray-700">Help & Support</span>
              <ChevronRight size={16} className="text-gray-400 ml-auto" />
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-100">
          <button 
            className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg transition-colors text-left group"
            onClick={handleLogoutClick}
          >
            <LogOut size={18} className="text-gray-500 group-hover:text-red-600" />
            <span className="text-sm text-gray-700 group-hover:text-red-600">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePane;
