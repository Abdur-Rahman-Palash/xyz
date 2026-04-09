'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FileText, Calendar, User, ArrowLeft, Tag } from 'lucide-react'

interface Notice {
  _id: string
  title: string
  content: string
  category: string
  priority: string
  publishedAt: string
  author: {
    username: string
    email: string
  }
  attachments: string[]
  isActive: boolean
}

export default function NoticePage({ params }: { params: { id: string } }) {
  const [notice, setNotice] = useState<Notice | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchNotice()
  }, [params.id])

  const fetchNotice = async () => {
    try {
      console.log('Fetching notice with ID:', params.id)
      
      // First try to get from localStorage
      const storedNotices = JSON.parse(localStorage.getItem('notices') || '[]')
      console.log('Stored notices:', storedNotices)
      
      // Try multiple ID matching strategies
      let notice = storedNotices.find((n: any) => n._id === params.id)
      
      // If not found, try string conversion
      if (!notice) {
        notice = storedNotices.find((n: any) => String(n._id) === String(params.id))
      }
      
      // If still not found, try index-based matching for demo data
      if (!notice && !isNaN(Number(params.id))) {
        const index = Number(params.id) - 1
        if (index >= 0 && index < storedNotices.length) {
          notice = storedNotices[index]
        }
      }
      
      console.log('Found notice:', notice)
      
      if (notice) {
        setNotice(notice)
        setLoading(false)
        return
      }

      // Fallback to API if not found in localStorage
      console.log('Fallback to API for notice:', params.id)
      const response = await fetch(`/api/notices/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setNotice(data)
      } else {
        console.log('API error:', data)
        toast.error(data.error || 'Notice not found')
        router.push('/notices')
      }
    } catch (error) {
      console.log('Fetch error:', error)
      toast.error('Failed to load notice')
      router.push('/notices')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notice...</p>
        </div>
      </div>
    )
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Notice Not Found</h1>
          <p className="text-gray-600 mb-8">The notice you're looking for doesn't exist.</p>
          <Link href="/notices">
            <Button className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Notices
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'administrative':
        return 'bg-blue-100 text-blue-800'
      case 'academic':
        return 'bg-purple-100 text-purple-800'
      case 'general':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/notices" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Notices
          </Link>
          
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{notice.title}</h1>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notice.priority)}`}>
                      {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)} Priority
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(notice.category)}`}>
                      {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                    </span>
                    {notice.isActive && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{notice.author.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(notice.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {notice.content}
                  </p>
                </div>
              </div>

              {notice.attachments && notice.attachments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h3>
                  <div className="space-y-2">
                    {notice.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t mt-6 pt-6">
                <p className="text-sm text-gray-600">
                  Published by <span className="font-medium text-gray-900">{notice.author.username}</span> ({notice.author.email})
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Link href="/notices">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Notices
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
