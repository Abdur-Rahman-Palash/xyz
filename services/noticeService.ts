import { INotice } from '@/models/Notice'

export interface CreateNoticeData {
  title: string
  content: string
  category?: 'general' | 'academic' | 'administrative' | 'emergency'
  priority?: 'low' | 'medium' | 'high'
  attachments?: string[]
  expiresAt?: string
}

export interface UpdateNoticeData extends Partial<CreateNoticeData> {
  isActive?: boolean
}

class NoticeService {
  private baseUrl = '/api/notices'

  async getAllNotices(params?: {
    page?: number
    limit?: number
    category?: string
    priority?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.category) searchParams.append('category', params.category)
    if (params?.priority) searchParams.append('priority', params.priority)

    const response = await fetch(`${this.baseUrl}?${searchParams}`)
    if (!response.ok) {
      throw new Error('Failed to fetch notices')
    }
    return response.json()
  }

  async getNoticeById(id: string) {
    const response = await fetch(`${this.baseUrl}/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch notice')
    }
    return response.json()
  }

  async createNotice(data: CreateNoticeData) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create notice')
    }

    return response.json()
  }

  async updateNotice(id: string, data: UpdateNoticeData) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update notice')
    }

    return response.json()
  }

  async deleteNotice(id: string) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete notice')
    }

    return response.json()
  }
}

export const noticeService = new NoticeService()
