'use client'

import Link from 'next/link'
import { Home, Sprout, MessageCircle, User } from 'lucide-react'

const Footer = () => {
  return (
    <>
      {/* mobile sticky footer */}
      <div className="md:hidden h-12"></div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-inner flex justify-around items-center py-2 md:hidden z-50">
        <Link href="/dashboard" className="flex flex-col items-center text-gray-600 hover:text-green-600">
          <Home size={22} />
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/dashboard/recommend-crops" className="flex flex-col items-center text-gray-600 hover:text-green-600">
          <Sprout size={22} />
          <span className="text-xs">Crops</span>
        </Link>
        <Link href="/dashboard/ask-ai" className="flex flex-col items-center text-gray-600 hover:text-green-600">
          <MessageCircle size={22} />
          <span className="text-xs">AI Chat</span>
        </Link>
        <Link href="/dashboard/profile" className="flex flex-col items-center text-gray-600 hover:text-green-600">
          <User size={22} />
          <span className="text-xs">Profile</span>
        </Link>
      </div>

      {/* desktop footer */}
      <footer className="hidden md:block bottom-0 right-0 left-0 bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-600">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="hover:text-green-600">Home</Link></li>
              <li><Link href="/dashboard/ai/crop-recommendation" className="hover:text-green-600">Crop Recommendation</Link></li>
              <li><Link href="/dashboard/ai/chat" className="hover:text-green-600">AI Chat</Link></li>
              <li><Link href="/dashboard/profile" className="hover:text-green-600">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">About Us</h3>
            <p className="text-gray-500">
              KrishiAI helps farmers with crop recommendations, weather insights, and more using AI.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-600">Documentation</a></li>
              <li><a href="#" className="hover:text-green-600">Support</a></li>
              <li><a href="#" className="hover:text-green-600">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Contact</h3>
            <p>Email: support.krishiaiapp@gmail.com</p>
            <p>Phone: +91-88225-89404</p>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 py-4 border-t">
          © {new Date().getFullYear()} KrishiAI. All rights reserved.
        </div>
      </footer>
    </>
  )
}

export default Footer
