import { NextRequest, NextResponse } from 'next/server'

// Demo credentials for fast loading
const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
  user: {
    id: 'demo-admin-id',
    username: 'admin',
    email: 'admin@xyz.com',
    role: 'admin'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log('Login attempt:', { username, password: '***' })

    if (!username || !password) {
      console.log('Missing credentials')
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    console.log('Demo credentials:', DEMO_CREDENTIALS)
    console.log('Comparison:', {
      username: username === DEMO_CREDENTIALS.username,
      password: password === DEMO_CREDENTIALS.password
    })

    // Check demo credentials (trim whitespace and case insensitive for username)
    if (username.trim() === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      console.log('Login successful')
      const response = NextResponse.json({
        message: 'Login successful',
        user: DEMO_CREDENTIALS.user
      })

      // Set a simple session cookie
      response.cookies.set('admin-session', 'demo-admin-logged-in', {
        httpOnly: true,
        secure: false, // Set to false for development
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })

      return response
    }

    console.log('Invalid credentials')
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
