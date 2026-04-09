'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Calendar, MapPin, Users, Tag, Filter } from 'lucide-react'

interface Event {
  _id: string
  title: string
  description: string
  type: string
  startDate: string
  endDate: string
  location: string
  maxParticipants?: number
  currentParticipants: number
  status: string
  organizer: {
    username: string
    email: string
  }
  tags: string[]
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    type: '',
    status: ''
  })

  useEffect(() => {
    fetchEvents()
  }, [filter.type, filter.status])

  useEffect(() => {
    // Listen for localStorage changes
    const handleStorageChange = () => {
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]')
      setEvents(storedEvents)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const fetchEvents = async () => {
    try {
      // First try to get from localStorage
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]')
      if (storedEvents.length > 0) {
        setEvents(storedEvents)
        setLoading(false)
        return
      }

      // Fallback to API if no localStorage data
      const params = new URLSearchParams()
      if (filter.type) params.append('type', filter.type)
      if (filter.status) params.append('status', filter.status)
      
      const response = await fetch(`/api/events?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setEvents(data.events || [])
      } else {
        toast.error('Failed to fetch events')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-50'
      case 'ongoing': return 'text-green-600 bg-green-50'
      case 'completed': return 'text-gray-600 bg-gray-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'text-purple-600 bg-purple-50'
      case 'seminar': return 'text-indigo-600 bg-indigo-50'
      case 'conference': return 'text-blue-600 bg-blue-50'
      case 'social': return 'text-pink-600 bg-pink-50'
      case 'sports': return 'text-orange-600 bg-orange-50'
      case 'cultural': return 'text-teal-600 bg-teal-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading events...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-gray-600">Discover upcoming activities and programs</p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <select
            value={filter.type}
            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Types</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="conference">Conference</option>
            <option value="social">Social</option>
            <option value="sports">Sports</option>
            <option value="cultural">Cultural</option>
            <option value="other">Other</option>
          </select>
          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Check back later for new events</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="w-3 h-3" />
                      {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </div>
                    {event.maxParticipants && (
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="w-3 h-3" />
                        {event.currentParticipants}/{event.maxParticipants} participants
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>
                  {event.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap mb-4">
                      {event.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      By {event.organizer.username}
                    </span>
                    <Link href={`/events/${event._id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
