'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Image src="logo.svg" alt="KrishiAI Logo" height={28} width={28} className="rounded-lg object-cover" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  KrishiAI
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Features
              </Link>
              
              <div className="relative group">
                <button 
                  className="flex items-center gap-1 text-gray-700 hover:text-green-600 font-medium transition-colors"
                  onMouseEnter={() => setProductsOpen(true)}
                  onMouseLeave={() => setProductsOpen(false)}
                >
                  Products
                  <ChevronDown size={16} className={`transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {productsOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2"
                    onMouseEnter={() => setProductsOpen(true)}
                    onMouseLeave={() => setProductsOpen(false)}
                  >
                    <Link href="/products/crop-recommendation" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                      <div className="font-medium">Crop Recommendation</div>
                      <div className="text-xs text-gray-500">AI-powered crop insights</div>
                    </Link>
                    <Link href="/products/weather-forecast" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                      <div className="font-medium">Weather Forecast</div>
                      <div className="text-xs text-gray-500">Real-time weather updates</div>
                    </Link>
                    <Link href="/products/market-prices" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                      <div className="font-medium">Market Prices</div>
                      <div className="text-xs text-gray-500">Live commodity pricing</div>
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/#how-it-works" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                How It Works
              </Link>
              
              <Link href="/#pricing" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Pricing
              </Link>
              
              <Link href="/about" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                About
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <button className="px-5 py-2.5 text-gray-700 hover:text-green-600 font-medium transition-colors">
                  Log In
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-6 space-y-4">
              <Link 
                href="/#features" 
                className="block text-gray-700 hover:text-green-600 font-medium py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              
              <div className="space-y-2">
                <div className="text-gray-700 font-medium py-2">Products</div>
                <Link 
                  href="/products/crop-recommendation" 
                  className="block pl-4 text-gray-600 hover:text-green-600 py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Crop Recommendation
                </Link>
                <Link 
                  href="/products/weather-forecast" 
                  className="block pl-4 text-gray-600 hover:text-green-600 py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Weather Forecast
                </Link>
                <Link 
                  href="/products/market-prices" 
                  className="block pl-4 text-gray-600 hover:text-green-600 py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Market Prices
                </Link>
              </div>

              <Link 
                href="/#how-it-works" 
                className="block text-gray-700 hover:text-green-600 font-medium py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              
              <Link 
                href="/#pricing" 
                className="block text-gray-700 hover:text-green-600 font-medium py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              
              <Link 
                href="/about" 
                className="block text-gray-700 hover:text-green-600 font-medium py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>

              <div className="pt-4 space-y-3 border-t border-gray-100">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-5 py-3 text-gray-700 border border-gray-300 hover:border-green-600 hover:text-green-600 font-medium rounded-xl transition-colors">
                    Log In
                  </button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg transition-all">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar
