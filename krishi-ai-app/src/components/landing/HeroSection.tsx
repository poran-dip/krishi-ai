"use client"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

const HeroSection = () => {
  return (
    <section className="relative flex flex-col min-h-screen items-center justify-center text-center overflow-hidden bg-gradient-to-b from-green-50 to-white">
      
      {/* background accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-green-200/20 blur-3xl" />
      </div>

      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Image 
          src="/logo.svg" 
          alt="KrishiAI Logo" 
          width={80} 
          height={80} 
          className="w-20 mx-auto drop-shadow-md" 
          priority 
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          KrishiAI
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto">
          AI-powered farming decisions, simplified
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Link href="/dashboard">
          <button className="mt-6 h-12 px-8 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold shadow-lg hover:shadow-green-400/30 transition-all duration-200">
            Get Started →
          </button>
        </Link>
      </motion.div>

      <motion.p 
        className="mt-6 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Helping farmers make smarter crop choices.
      </motion.p>
    </section>
  )
}

export default HeroSection
