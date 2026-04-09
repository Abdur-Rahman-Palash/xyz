import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({
    message: 'Logout successful'
  })

  response.cookies.set('admin-session', '', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 0,
  })

  return response
}
