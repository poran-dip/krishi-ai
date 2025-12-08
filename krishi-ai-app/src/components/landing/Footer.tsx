'use client'

import Link from 'next/link'
import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Section */}
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

          {/* Product Links */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#features" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Guides
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Mail size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <a href="mailto:support.krishiaiapp@gmail.com" className="text-sm hover:text-green-600 transition-colors">
                  support@krishiai.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Phone size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <a href="tel:+918822589404" className="text-sm hover:text-green-600 transition-colors">
                  +91-88225-89404
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Dispur, Assam, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} KrishiAI. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link href="/login" className="hover:text-green-600 transition-colors">
              Login
            </Link>
            <Link href="/signup" className="hover:text-green-600 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
