// app/api/v1/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Just verify the user exists without updating
    const existingUser = await prisma.farmer.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      message: 'Token is valid',
      user: existingUser
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
