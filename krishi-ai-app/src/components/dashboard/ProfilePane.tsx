'use client'

import React, { useState, useRef, useEffect } from 'react';
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

interface ProfilePaneProps {
  onClose: () => void
}

const ProfilePane = ({ onClose }: ProfilePaneProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
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
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Raj Kumar</h3>
              <p className="text-sm text-gray-600">raj.kumar@email.com</p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <MapPin size={12} />
                Pune, Maharashtra
              </p>
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
              <Crop size={16} className="text-green-600" />
              <div>
                <p className="text-gray-500">Land Area</p>
                <p className="font-medium">7.5 acres</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award size={16} className="text-blue-600" />
              <div>
                <p className="text-gray-500">Experience</p>
                <p className="font-medium">12 years</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-orange-600" />
              <div>
                <p className="text-gray-500">Mobile</p>
                <p className="font-medium">+91 98765 43210</p>
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
            {['Wheat', 'Rice', 'Maize'].map((crop) => (
              <span 
                key={crop}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
              >
                {crop}
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
          <button className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg transition-colors text-left group">
            <LogOut size={18} className="text-gray-500 group-hover:text-red-600" />
            <span className="text-sm text-gray-700 group-hover:text-red-600">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePane;
