import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super-refresh'

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

    // Check if user already exists
    const existingUser = await prisma.farmer.findUnique({
      where: { 
        email: email.toLowerCase() 
      }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create new user
    const newUser = await prisma.farmer.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: `${firstName.trim()} ${lastName.trim()}`,
        lastSync: new Date()
      }
    })

    // Generate JWT tokens
    const tokenPayload = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name
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
      name: newUser.name
    }

    return NextResponse.json({
      message: 'Account created successfully',
      user: userResponse,
      token: accessToken
    }, { status: 201 })

  } catch (error) {
    console.error('Sign up error:', error)
    
    // Handle Prisma-specific errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
