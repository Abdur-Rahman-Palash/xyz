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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')

    let filteredNotices = [...DEMO_NOTICES]

    if (category) {
      filteredNotices = filteredNotices.filter(notice => notice.category === category)
    }

    if (priority) {
      filteredNotices = filteredNotices.filter(notice => notice.priority === priority)
    }

    const skip = (page - 1) * limit
    const paginatedNotices = filteredNotices.slice(skip, skip + limit)

    return NextResponse.json({
      notices: paginatedNotices,
      pagination: {
        page,
        limit,
        total: filteredNotices.length,
        pages: Math.ceil(filteredNotices.length / limit)
      }
    })
  } catch (error) {
    console.error('Get notices error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, category, priority, attachments, expiresAt } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // In demo mode, just return success without actually creating
    const newNotice = {
      _id: Date.now().toString(),
      title,
      content,
      category: category || 'general',
      priority: priority || 'medium',
      publishedAt: new Date().toISOString(),
      author: {
        username: 'admin',
        email: 'admin@xyz.com'
      },
      attachments: attachments || [],
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      isActive: true
    }

    return NextResponse.json(newNotice, { status: 201 })
  } catch (error) {
    console.error('Create notice error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
