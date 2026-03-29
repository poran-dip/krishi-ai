import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Signed out successfully' })

    // Clear the refresh token
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
