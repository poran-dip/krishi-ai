'use client'

import Dashboard from "@/components/dashboard/Dashboard"
import LoginPage from "@/components/auth/LoginPage"
import { useState } from "react"

const DashboardPage = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const [email, setEmail] = useState<string>('')

  if (!authenticated) {
    return <LoginPage onLogin={(email) => {
      setEmail(email)
      setAuthenticated(true)
    }} />
  }

  return <Dashboard name={email} />
}

export default DashboardPage
