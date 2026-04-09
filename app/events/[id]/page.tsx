'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Calendar, MapPin, Users, Clock, ArrowLeft, Tag } from 'lucide-react'

interface Event {
  _id: string
  title: string
  description: string
  type: string
  startDate: string
  endDate: string
  location: string
  maxParticipants: number
  currentParticipants: number
  registrationDeadline: string
  isRegistrationRequired: boolean
  status: string
  organizer: {
    username: string
    email: string
  }
  tags: string[]
  attachments: string[]
}

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchEvent()
  }, [params.id])

  const fetchEvent = async () => {
    try {
      console.log('Fetching event with ID:', params.id)
      
      // First try to get from localStorage
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]')
      console.log('Stored events:', storedEvents)
      
      // Try multiple ID matching strategies
      let event = storedEvents.find((e: any) => e._id === params.id)
      
      // If not found, try string conversion
      if (!event) {
        event = storedEvents.find((e: any) => String(e._id) === String(params.id))
      }
      
      // If still not found, try index-based matching for demo data
      if (!event && !isNaN(Number(params.id))) {
        const index = Number(params.id) - 1
        if (index >= 0 && index < storedEvents.length) {
          event = storedEvents[index]
        }
      }
      
      console.log('Found event:', event)
      
      if (event) {
        setEvent(event)
        setLoading(false)
        return
      }

      // Fallback to API if not found in localStorage
      console.log('Fallback to API for event:', params.id)
      const response = await fetch(`/api/events/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setEvent(data)
      } else {
        console.log('API error:', data)
        toast.error(data.error || 'Event not found')
        router.push('/events')
      }
    } catch (error) {
      console.log('Fetch error:', error)
      toast.error('Failed to load event')
      router.push('/events')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-8">The event you're looking for doesn't exist.</p>
          <Link href="/events">
            <Button className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isRegistrationOpen = event.isRegistrationRequired && 
    new Date(event.registrationDeadline) > new Date()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/events" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">{event.description}</p>
            </div>

            {/* Event Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Start Date & Time</p>
                    <p className="text-gray-600">{formatDate(event.startDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">End Date & Time</p>
                    <p className="text-gray-600">{formatDate(event.endDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Participants</p>
                    <p className="text-gray-600">{event.currentParticipants} / {event.maxParticipants}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {event.isRegistrationRequired && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Registration Deadline</p>
                      <p className="text-gray-600">{formatDate(event.registrationDeadline)}</p>
                      <p className={`text-sm mt-1 ${isRegistrationOpen ? 'text-green-600' : 'text-red-600'}`}>
                        {isRegistrationOpen ? 'Registration Open' : 'Registration Closed'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {event.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600">
                Organized by <span className="font-medium text-gray-900">{event.organizer.username}</span> ({event.organizer.email})
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Link href="/events">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Button>
          </Link>
          {isRegistrationOpen && (
            <Button className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Register for Event
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
