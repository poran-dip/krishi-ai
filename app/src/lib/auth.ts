// lib/auth.ts
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key'

export interface AuthUser {
  userId: string
  email: string
  name: string
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch {
    return null
  }
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    return verifyToken(token)
  } catch {
    return null
  }
}

// Middleware function to protect routes
export function withAuth(handler: (request: NextRequest, user: AuthUser) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = getAuthUser(request)
    
    if (!user) {
      return Response.json(
        { message: 'Unauthorized - Invalid or missing token' },
        { status: 401 }
      )
    }

    return handler(request, user)
  }
}

// Client-side auth utilities
export const authUtils = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  },

  setToken(token: string, remember: boolean = false): void {
    if (typeof window === 'undefined') return
    
    if (remember) {
      localStorage.setItem('token', token)
      sessionStorage.removeItem('token')
    } else {
      sessionStorage.setItem('token', token)
      localStorage.removeItem('token')
    }
  },

  removeToken(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },

  getAuthHeaders(): HeadersInit {
    const token = this.getToken()
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  },

  updateToken(newToken: string): void {
    if (typeof window === 'undefined') return
    
    // Preserve the storage method (localStorage vs sessionStorage)
    const hasLocalToken = localStorage.getItem('token')
    const hasSessionToken = sessionStorage.getItem('token')
    
    if (hasLocalToken) {
      localStorage.setItem('token', newToken)
    } else if (hasSessionToken) {
      sessionStorage.setItem('token', newToken)
    } else {
      // Default to localStorage if neither exists
      localStorage.setItem('token', newToken)
    }
  }
}
