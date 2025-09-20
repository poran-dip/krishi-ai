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

    // Update lastSync in database
    const updatedUser = await prisma.farmer.update({
      where: { id: user.userId },
      data: { lastSync: new Date() },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    // Return user data from database
    return NextResponse.json({
      message: 'Token is valid',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name
      }
    })

  } catch (error) {
    console.error('Token verification error:', error)
    
    // Handle case where user doesn't exist in database
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
