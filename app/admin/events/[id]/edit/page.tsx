'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { ArrowLeft, Save } from 'lucide-react'

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

export default function EditEventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'conference',
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: 50,
    registrationDeadline: '',
    isRegistrationRequired: true,
    status: 'upcoming',
    tags: ''
  })

  useEffect(() => {
    fetchEvent()
  }, [params.id])

  const fetchEvent = async () => {
    try {
      // First try to get from localStorage
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]')
      const foundEvent = storedEvents.find((e: any) => e._id === params.id)
      
      if (foundEvent) {
        setEvent(foundEvent)
        setFormData({
          title: foundEvent.title,
          description: foundEvent.description,
          type: foundEvent.type,
          startDate: foundEvent.startDate.split('T')[0],
          endDate: foundEvent.endDate.split('T')[0],
          location: foundEvent.location,
          maxParticipants: foundEvent.maxParticipants,
          registrationDeadline: foundEvent.registrationDeadline ? foundEvent.registrationDeadline.split('T')[0] : '',
          isRegistrationRequired: foundEvent.isRegistrationRequired,
          status: foundEvent.status,
          tags: foundEvent.tags.join(', ')
        })
        setLoading(false)
        return
      }

      // Fallback to API
      const response = await fetch(`/api/events/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setEvent(data)
        setFormData({
          title: data.title,
          description: data.description,
          type: data.type,
          startDate: data.startDate.split('T')[0],
          endDate: data.endDate.split('T')[0],
          location: data.location,
          maxParticipants: data.maxParticipants,
          registrationDeadline: data.registrationDeadline ? data.registrationDeadline.split('T')[0] : '',
          isRegistrationRequired: data.isRegistrationRequired,
          status: data.status,
          tags: data.tags.join(', ')
        })
      } else {
        toast.error(data.error || 'Event not found')
        router.push('/admin/events')
      }
    } catch (error) {
      toast.error('Failed to load event')
      router.push('/admin/events')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      const response = await fetch(`/api/events/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Event updated successfully!')
        
        // Update localStorage
        const storedEvents = JSON.parse(localStorage.getItem('events') || '[]')
        const updatedEvents = storedEvents.map((e: any) => 
          e._id === params.id ? { ...e, ...payload } : e
        )
        localStorage.setItem('events', JSON.stringify(updatedEvents))
        
        // Trigger storage event
        localStorage.setItem('dashboard-refresh', Date.now().toString())
        
        router.push('/admin/events')
      } else {
        toast.error(data.error || 'Failed to update event')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setSaving(false)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/events" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Manage Events
          </Link>
          
          <Card>
            <CardHeader>
              <CardTitle>Edit Event</CardTitle>
              <CardDescription>
                Update the event information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title
                  </label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type
                    </label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="conference">Conference</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="social">Social</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    required
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                      Max Participants
                    </label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Deadline
                    </label>
                    <Input
                      id="registrationDeadline"
                      type="date"
                      value={formData.registrationDeadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <Input
                    id="tags"
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="technology, workshop, networking"
                    className="w-full"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Link href="/admin/events">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={saving} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
