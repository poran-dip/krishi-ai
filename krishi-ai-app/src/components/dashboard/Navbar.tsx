'use client'

import React, { useEffect, useState } from 'react';
import { Bell, Lightbulb, User } from 'lucide-react';
import NotificationsPane from './NotificationsPane';
import ProfilePane from './ProfilePane';
import Link from 'next/link';
import Image from 'next/image';

const notifications = [
  { id: 1, type: "weather", message: "Light rain expected in 2 days", time: "1h ago" },
  { id: 2, type: "market", message: "Wheat prices increased by 5%", time: "3h ago" },
  { id: 3, type: "reminder", message: "Time to apply fertilizer to rice field", time: "1d ago" }
];

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
      if (isDesktop) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  
  const handleRecommendationsClick = () => {
    // Your recommendations logic
    console.log('Get crop recommendations');
  };
  
  return (
    <>
      {/* Sticky Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md transition-all duration-300 hover:opacity-100 md:opacity-80 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <Link href="/dashboard">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-200 rounded-lg flex items-center justify-center border-1 border-yellow-500">
                  <Image src="logo.svg" alt="Logo" height={24} width={24} className="rounded-lg object-cover" />
                </div>
                <span className="text-xl font-bold text-gray-900">KrishiAI</span>
              </div>
            </Link>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer"
                onClick={handleRecommendationsClick}
              >
                <Lightbulb size={16} />
                <span className="hidden md:inline">Get AI Crop Recommendations!</span>
              </button>
              <button
                data-notifications-button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={16} />
                <span className="hidden md:inline">Notifications</span>
              </button>
              <button 
                data-profile-button
                className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfile(!showProfile);
                }}
              >
                <User size={16} />
                <span className="hidden md:inline">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showNotifications && (
        <NotificationsPane 
          notifications={notifications} 
          onClose={() => setShowNotifications(false)} 
        />
      )}

      {showProfile &&
        <ProfilePane onClose={() => setShowProfile(false)} />
      }

      {/* Spacer to prevent content from hiding behind sticky navbar */}
      <div className="h-12"></div>
    </>
  );
};

export default Navbar;
