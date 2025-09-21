// app/api/v1/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

export async function GET(request: NextRequest) {
  if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be defined')
  }

  try {
    // First, try to get user from session token
    const user = getAuthUser(request)
    
    if (user) {
      // Session token is valid, verify user exists
      const existingUser = await prisma.farmer.findUnique({
        where: { id: user.userId },
        select: {
          id: true,
          email: true,
          name: true
        }
      })

      if (existingUser) {
        return NextResponse.json({
          message: 'Token is valid',
          user: existingUser
        })
      }
    }

    // Session token is missing/invalid, check for refresh token
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'No valid tokens found' },
        { status: 401 }
      )
    }

    // Verify refresh token
    let refreshPayload
    try {
      refreshPayload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string }
    } catch (error) {
      // Refresh token is invalid, clear it
      const response = NextResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 }
      )
      response.cookies.delete('refreshToken')
      return response
    }

    // Refresh token is valid, get user and issue new access token
    const existingUser = await prisma.farmer.findUnique({
      where: { id: refreshPayload.userId },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    if (!existingUser) {
      const response = NextResponse.json(
        { message: 'User not found' },
        { status: 401 }
      )
      response.cookies.delete('refreshToken')
      return response
    }

    // Generate new access token
    const tokenPayload = {
      userId: existingUser.id,
      email: existingUser.email,
      name: existingUser.name
    }

    const newAccessToken = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { expiresIn: '15m' }
    )

    return NextResponse.json({
      message: 'Token refreshed successfully',
      user: existingUser,
      token: newAccessToken
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
