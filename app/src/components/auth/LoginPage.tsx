'use client'

import { useState } from 'react'
import Image from 'next/image'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import ForgotPasswordForm from './ForgotPasswordForm'

export interface User {
  id: string
  email: string
  name: string
}

interface LoginPageProps {
  onLogin: (user: User) => void
}

type ViewType = 'signin' | 'signup' | 'forgot-password'

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [currentView, setCurrentView] = useState<ViewType>('signin')

  const handleAuthSuccess = (user: User) => {
    onLogin(user)
  }

  const handleSwitchToSignUp = () => {
    setCurrentView('signup')
  }

  const handleSwitchToSignIn = () => {
    setCurrentView('signin')
  }

  const handleForgotPassword = () => {
    setCurrentView('forgot-password')
  }

  const handleBackToSignIn = () => {
    setCurrentView('signin')
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'signup':
        return (
          <SignUpForm 
            onSuccess={handleAuthSuccess}
            onSwitchToSignIn={handleSwitchToSignIn}
          />
        )
      case 'forgot-password':
        return (
          <ForgotPasswordForm 
            onBack={handleBackToSignIn}
          />
        )
      default:
        return (
          <SignInForm 
            onSuccess={handleAuthSuccess}
            onSwitchToSignUp={handleSwitchToSignUp}
            onForgotPassword={handleForgotPassword}
          />
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {currentView === 'signin' && (
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1 flex items-center justify-center gap-2">
              <Image src="/logo.svg" alt="KrishiAI Logo" width={28} height={28} />
              KrishiAI
            </div>
          </div>
        )}
        
        {renderCurrentView()}
      </div>
    </div>
  )
}

export default LoginPage
