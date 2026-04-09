import { NextRequest, NextResponse } from 'next/server'

// Demo data for fast loading
const DEMO_EVENTS = [
  {
    _id: '1',
    title: 'Annual Tech Conference 2024',
    description: 'Join us for our biggest tech conference of the year featuring keynote speakers, workshops, and networking opportunities.',
    type: 'conference',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Main Auditorium',
    maxParticipants: 200,
    currentParticipants: 45,
    registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    isRegistrationRequired: true,
    status: 'upcoming',
    organizer: {
      username: 'admin',
      email: 'admin@xyz.com'
    },
    tags: ['technology', 'conference', 'networking'],
    attachments: []
  },
  {
    _id: '2',
    title: 'React Workshop for Beginners',
    description: 'Learn the basics of React.js in this hands-on workshop designed for beginners. No prior experience required.',
    type: 'workshop',
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    location: 'Computer Lab 101',
    maxParticipants: 30,
    currentParticipants: 28,
    registrationDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRegistrationRequired: true,
    status: 'upcoming',
    organizer: {
      username: 'admin',
      email: 'admin@xyz.com'
    },
    tags: ['react', 'javascript', 'workshop', 'beginners'],
    attachments: []
  },
  {
    _id: '3',
    title: 'Company Annual Picnic',
    description: 'Join us for a fun-filled day of activities, games, and great food at our annual company picnic.',
    type: 'social',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    location: 'Central Park',
    maxParticipants: 100,
    currentParticipants: 67,
    registrationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    isRegistrationRequired: true,
    status: 'upcoming',
    organizer: {
      username: 'admin',
      email: 'admin@xyz.com'
    },
    tags: ['social', 'picnic', 'fun', 'team-building'],
    attachments: []
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    let filteredEvents = [...DEMO_EVENTS]

    if (type) {
      filteredEvents = filteredEvents.filter(event => event.type === type)
    }

    if (status) {
      filteredEvents = filteredEvents.filter(event => event.status === status)
    }

    const skip = (page - 1) * limit
    const paginatedEvents = filteredEvents.slice(skip, skip + limit)

    return NextResponse.json({
      events: paginatedEvents,
      pagination: {
        page,
        limit,
        total: filteredEvents.length,
        pages: Math.ceil(filteredEvents.length / limit)
      }
    })
  } catch (error) {
    console.error('Get events error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      type,
      startDate,
      endDate,
      location,
      maxParticipants,
      registrationDeadline,
      isRegistrationRequired,
      tags,
      attachments
    } = await request.json()

    if (!title || !description || !startDate || !endDate || !location) {
      return NextResponse.json(
        { error: 'Title, description, start date, end date, and location are required' },
        { status: 400 }
      )
    }

    // In demo mode, just return success without actually creating
    const newEvent = {
      _id: Date.now().toString(),
      title,
      description,
      type: type || 'other',
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      location,
      maxParticipants,
      currentParticipants: 0,
      registrationDeadline: registrationDeadline ? new Date(registrationDeadline).toISOString() : undefined,
      isRegistrationRequired: isRegistrationRequired || false,
      status: 'upcoming',
      organizer: {
        username: 'admin',
        email: 'admin@xyz.com'
      },
      tags: tags || [],
      attachments: attachments || []
    }

    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
