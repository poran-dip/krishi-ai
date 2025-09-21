'use client'

import Dashboard from "@/components/dashboard/Dashboard"
import LoginPage from "@/components/auth/LoginPage"
import Onboarding from "@/components/onboarding/Onboarding"
import { useState, useEffect } from "react"
import { authUtils } from "@/lib/auth"
import { isProfileComplete } from "@/lib/utils"

interface User {
  id: string
  email: string
  name: string
}

const DashboardPage = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profileComplete, setProfileComplete] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In DashboardPage component, replace the checkAuth function:
    const checkAuth = async () => {
      const token = authUtils.getToken()
      
      try {
        // Always call verify (it will handle missing tokens and refresh logic)
        const response = await fetch('/api/v1/auth/verify', {
          method: 'GET',
          credentials: 'include', // Important: includes cookies for refresh token
          headers: token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } : {
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setAuthenticated(true)

          // If we got a new token, store it (this happens when refresh token was used)
          if (data.token) {
            authUtils.setToken(data.token, true) // Assume remember=true if refresh token existed
          }

          // fetch farmer profile
          const currentToken = data.token || token // Use new token if provided
          const profileRes = await fetch('/api/v1/protected/profile', {
            headers: {
              'Authorization': `Bearer ${currentToken}`
            }
          })

          if (profileRes.ok) {
            const farmer = await profileRes.json()
            setProfileComplete(isProfileComplete(farmer.data))
          } else {
            setProfileComplete(false)
          }
        } else {
          authUtils.removeToken()
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        authUtils.removeToken()
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    setAuthenticated(true)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/signout', {
        method: 'POST',
        headers: authUtils.getAuthHeaders()
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      authUtils.removeToken()
      setUser(null)
      setAuthenticated(false)
    }
  }

  const handleOnboardingComplete = async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  
    const token = authUtils.getToken();
    
    try {
      const verifyRes = await fetch('/api/v1/auth/verify', {
        method: 'GET',
        credentials: 'include', // Add this
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (!verifyRes.ok) {
        console.log('Token expired, user needs to re-login');
        handleLogout();
        return;
      }

      // Check if we got a new token and update it
      const verifyData = await verifyRes.json();
      if (verifyData.token) {
        authUtils.updateToken(verifyData.token);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      handleLogout();
      return;
    }

    // Now fetch profile with verified token
    try {
      const profileRes = await fetch('/api/v1/protected/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (profileRes.ok) {
        const farmer = await profileRes.json();
        console.log('Profile refetched after onboarding:', farmer);
        setProfileComplete(isProfileComplete(farmer.data));

        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      } else {
        console.log('Profile fetch failed after onboarding:', profileRes.status);
        setProfileComplete(false);
      }
    } catch (error) {
      console.error('Error refetching profile:', error);
      setProfileComplete(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!authenticated || !user) {
    return <LoginPage onLogin={handleLogin} />
  }

  // if user is authenticated but profile not filled -> onboarding
  if (!profileComplete) {
    return <Onboarding user={user} onComplete={handleOnboardingComplete} />
  }

  return (
    <Dashboard 
      user={{
        name: user.name,
        email: user.email
      }}
      onLogout={handleLogout}
    />
  )
}

export default DashboardPage
