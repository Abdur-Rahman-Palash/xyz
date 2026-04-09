import { IEvent } from '@/models/Event'

export interface CreateEventData {
  title: string
  description: string
  type?: 'workshop' | 'seminar' | 'conference' | 'social' | 'sports' | 'cultural' | 'other'
  startDate: string
  endDate: string
  location: string
  maxParticipants?: number
  registrationDeadline?: string
  isRegistrationRequired?: boolean
  tags?: string[]
  attachments?: string[]
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  currentParticipants?: number
}

class EventService {
  private baseUrl = '/api/events'

  async getAllEvents(params?: {
    page?: number
    limit?: number
    type?: string
    status?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.type) searchParams.append('type', params.type)
    if (params?.status) searchParams.append('status', params.status)

    const response = await fetch(`${this.baseUrl}?${searchParams}`)
    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }
    return response.json()
  }

  async getEventById(id: string) {
    const response = await fetch(`${this.baseUrl}/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch event')
    }
    return response.json()
  }

  async createEvent(data: CreateEventData) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create event')
    }

    return response.json()
  }

  async updateEvent(id: string, data: UpdateEventData) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update event')
    }

    return response.json()
  }

  async deleteEvent(id: string) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete event')
    }

    return response.json()
  }
}

export const eventService = new EventService()
