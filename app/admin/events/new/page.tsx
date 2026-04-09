'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { ArrowLeft, Save, Calendar, MapPin, Users, Tag } from 'lucide-react'

export default function NewEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'other',
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: '',
    registrationDeadline: '',
    isRegistrationRequired: false,
    tags: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        registrationDeadline: formData.registrationDeadline || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Event created successfully!')
        
        // Store new event in localStorage for immediate display
        const existingEvents = JSON.parse(localStorage.getItem('events') || '[]')
        existingEvents.unshift(data)
        localStorage.setItem('events', JSON.stringify(existingEvents))
        
        // Trigger dashboard update via storage event
        localStorage.setItem('dashboard-refresh', Date.now().toString())
        
        router.push('/admin/dashboard?refresh=true')
      } else {
        toast.error(data.error || 'Failed to create event')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/events">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
            <p className="text-gray-600">Add a new event for the organization</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Event Details
            </CardTitle>
            <CardDescription>
              Fill in the information below to create a new event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="conference">Conference</option>
                    <option value="social">Social</option>
                    <option value="sports">Sports</option>
                    <option value="cultural">Cultural</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter event description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time *
                  </label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time *
                  </label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter event location"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                    Max Participants (Optional)
                  </label>
                  <Input
                    id="maxParticipants"
                    name="maxParticipants"
                    type="number"
                    min="1"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    placeholder="Maximum number of participants"
                  />
                </div>

                <div>
                  <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Deadline (Optional)
                  </label>
                  <Input
                    id="registrationDeadline"
                    name="registrationDeadline"
                    type="datetime-local"
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRegistrationRequired"
                  name="isRegistrationRequired"
                  checked={formData.isRegistrationRequired}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="isRegistrationRequired" className="text-sm font-medium text-gray-700">
                  Registration Required
                </label>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <Input
                  id="tags"
                  name="tags"
                  type="text"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Enter tags separated by commas (e.g., workshop, learning, tech)"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Creating...' : 'Create Event'}
                </Button>
                <Link href="/admin/events">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
