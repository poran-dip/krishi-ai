'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

interface ForgotPasswordFormProps {
  onBack: () => void
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email')
      }

      setSuccess(true)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(String(err)) // fallback for non-Error throws
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-3 p-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Check Your Email
          </h1>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <p className="text-gray-600 mb-6">
            We&apos;ve sent a password reset link to <strong>{email}</strong>
          </p>

          <button
            onClick={onBack}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-3 p-1 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Reset Password
        </h1>
      </div>

      <p className="text-gray-600 mb-6">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter your email"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-6">
        Remember your password?{' '}
        <button
          onClick={onBack}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Sign In
        </button>
      </p>
    </div>
  )
}

export default ForgotPasswordForm
