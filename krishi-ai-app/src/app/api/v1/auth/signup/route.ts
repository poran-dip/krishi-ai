// app/api/v1/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

// This would typically come from your database
// Replace with your actual user model/database queries
interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  createdAt: Date
}

// Mock user data - replace with actual database queries
const users: User[] = []

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password } = body

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Check if user already exists (replace with database query)
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create new user (replace with database insert)
    const newUser: User = {
      id: uuidv4(),
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      createdAt: new Date()
    }

    users.push(newUser)

    // Generate JWT tokens
    const tokenPayload = {
      userId: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName
    }

    const accessToken = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { userId: newUser.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '1d' }
    )

    // Set HTTP-only cookie for refresh token
    const cookieStore = await cookies();
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 1 day
      path: '/'
    })

    // Return user data and access token
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName
    }

    return NextResponse.json({
      message: 'Account created successfully',
      user: userResponse,
      token: accessToken
    }, { status: 201 })

  } catch (error) {
    console.error('Sign up error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}