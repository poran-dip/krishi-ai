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
    const checkAuth = async () => {
      const token = authUtils.getToken()
      
      if (token) {
        try {
          // verify token and get user
          const response = await fetch('/api/v1/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
            setAuthenticated(true)

            // fetch farmer profile
            const profileRes = await fetch('/api/v1/protected/profile', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })

            if (profileRes.ok) {
              const farmer = await profileRes.json()
              setProfileComplete(isProfileComplete(farmer.data))
            } else {
              setProfileComplete(false) // no profile = not complete
            }
          } else {
            authUtils.removeToken()
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          authUtils.removeToken()
        }
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
    // Small delay to ensure PUT request completes
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Refetch profile data with fresh token check
    const token = authUtils.getToken();
    
    // Check if token is still valid
    try {
      const verifyRes = await fetch('/api/v1/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!verifyRes.ok) {
        console.log('Token expired, user needs to re-login');
        handleLogout();
        return;
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
