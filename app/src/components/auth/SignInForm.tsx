'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { User } from './LoginPage'

interface SignInFormProps {
  onSuccess: (user: User) => void
  onSwitchToSignUp: () => void
  onForgotPassword: () => void
}

const SignInForm = ({ onSuccess, onSwitchToSignUp, onForgotPassword }: SignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/v1/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed')
      }

      // Store JWT token
      if (rememberMe) {
        localStorage.setItem('token', data.token)
      } else {
        sessionStorage.setItem('token', data.token)
      }

      onSuccess(data.user)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(String(err))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          Welcome back
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Sign in to your account
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full h-10 px-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full h-10 px-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Remember me</span>
          </label>

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-base rounded-lg font-medium flex items-center justify-center transition-colors"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            onClick={onSwitchToSignUp}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}

export default SignInForm
