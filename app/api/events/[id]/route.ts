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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = DEMO_EVENTS.find(e => e._id === params.id)

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Get event error:', error)
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
      status,
      tags,
      attachments
    } = await request.json()

    // In demo mode, just return success without actually updating
    const updatedEvent = {
      _id: params.id,
      title: title || 'Updated Event Title',
      description: description || 'Updated event description',
      type: type || 'other',
      startDate: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : new Date().toISOString(),
      location: location || 'Updated Location',
      maxParticipants: maxParticipants || 50,
      currentParticipants: 0,
      registrationDeadline: registrationDeadline ? new Date(registrationDeadline).toISOString() : undefined,
      isRegistrationRequired: isRegistrationRequired !== undefined ? isRegistrationRequired : false,
      status: status || 'upcoming',
      organizer: {
        username: 'admin',
        email: 'admin@xyz.com'
      },
      tags: tags || [],
      attachments: attachments || []
    }

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Update event error:', error)
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
      { message: 'Event deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
