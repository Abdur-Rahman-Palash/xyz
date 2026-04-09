import { NextRequest, NextResponse } from 'next/server'

// Demo data for fast loading
const DEMO_NOTICES = [
  {
    _id: '1',
    title: 'Welcome to XYZ Notice System',
    content: 'This is a demo notice to showcase the notice management system. You can create, read, update, and delete notices through the admin portal.',
    category: 'general',
    priority: 'medium',
    publishedAt: new Date().toISOString(),
    author: {
      username: 'admin',
      email: 'admin@xyz.com'
    },
    isActive: true
  },
  {
    _id: '2',
    title: 'System Maintenance Scheduled',
    content: 'Regular system maintenance is scheduled for this weekend. The system will be unavailable from 2 AM to 6 AM on Sunday.',
    category: 'administrative',
    priority: 'high',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    author: {
      username: 'admin',
      email: 'admin@xyz.com'
    },
    isActive: true
  },
  {
    _id: '3',
    title: 'New Event Announced',
    content: 'Join us for our annual tech conference next month. Registration is now open and seats are limited.',
    category: 'academic',
    priority: 'medium',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    author: {
      username: 'admin',
      email: 'admin@xyz.com'
    },
    isActive: true
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notice = DEMO_NOTICES.find(n => n._id === params.id)

    if (!notice) {
      return NextResponse.json(
        { error: 'Notice not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(notice)
  } catch (error) {
    console.error('Get notice error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, content, category, priority, attachments, expiresAt, isActive } = await request.json()

    // In demo mode, just return success without actually updating
    const updatedNotice = {
      _id: params.id,
      title: title || 'Updated Notice Title',
      content: content || 'Updated notice content',
      category: category || 'general',
      priority: priority || 'medium',
      publishedAt: new Date().toISOString(),
      author: {
        username: 'admin',
        email: 'admin@xyz.com'
      },
      attachments: attachments || [],
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      isActive: isActive !== undefined ? isActive : true
    }

    return NextResponse.json(updatedNotice)
  } catch (error) {
    console.error('Update notice error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In demo mode, just return success without actually deleting
    return NextResponse.json(
      { message: 'Notice deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete notice error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
