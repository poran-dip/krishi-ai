'use client'

import Link from 'next/link'
import { Home, Sprout, MessageCircle, User, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

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
      <footer className="hidden md:block bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Brand Section - Takes more space */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-2 mb-3">
                <Sprout className="text-green-600" size={24} />
                <h2 className="text-lg font-bold text-gray-800">KrishiAI</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Empowering farmers with AI-driven insights for smarter crop recommendations, 
                real-time weather updates, and personalized farming guidance.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-green-600 hover:border-green-600 transition-colors">
                  <Facebook size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-green-600 hover:border-green-600 transition-colors">
                  <Twitter size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-green-600 hover:border-green-600 transition-colors">
                  <Instagram size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-green-600 hover:border-green-600 transition-colors">
                  <Linkedin size={16} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="text-sm text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/ai/crop-recommendation" className="text-sm text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    Crop Recommendation
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/ai/chat" className="text-sm text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    AI Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/profile" className="text-sm text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    My Profile
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support & Resources */}
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Help Center</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">FAQs</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Guides</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-3">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Get In Touch</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <Mail size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <a href="mailto:support.krishiaiapp@gmail.com" className="text-sm hover:text-green-600 transition-colors">
                    support.krishiaiapp@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <Phone size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <a href="tel:+918822589404" className="text-sm hover:text-green-600 transition-colors">
                    +91 88225 89404
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <MapPin size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Dispur, Assam, India</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-green-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} KrishiAI. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-green-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-green-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-green-600 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
