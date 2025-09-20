import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

export async function POST(request: NextRequest) {
  if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be defined')
  }

  try {
    const body = await request.json()
    const { email, password, rememberMe } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.farmer.findUnique({
      where: { 
        email: email.toLowerCase() 
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update lastSync
    await prisma.farmer.update({
      where: { id: user.id },
      data: { lastSync: new Date() }
    })

    // Generate JWT tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name
    }

    const accessToken = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: rememberMe ? '7d' : '1d' }
    )

    // Set HTTP-only cookie for refresh token
    const cookieStore = await cookies();
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60, // 7 days or 1 day
      path: '/'
    })

    // Return user data and access token
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name
    }

    return NextResponse.json({
      message: 'Sign in successful',
      user: userResponse,
      token: accessToken
    })

  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
