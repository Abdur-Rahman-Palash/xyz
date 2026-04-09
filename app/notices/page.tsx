'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FileText, Plus, Edit, Trash2, Eye, ArrowLeft, Filter, Calendar } from 'lucide-react'

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
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    category: '',
    priority: ''
  })

  useEffect(() => {
    fetchNotices()
  }, [filter.category, filter.priority])

  useEffect(() => {
    // Listen for localStorage changes
    const handleStorageChange = () => {
      const storedNotices = JSON.parse(localStorage.getItem('notices') || '[]')
      setNotices(storedNotices)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const fetchNotices = async () => {
    try {
      // First try to get from localStorage
      const storedNotices = JSON.parse(localStorage.getItem('notices') || '[]')
      if (storedNotices.length > 0) {
        setNotices(storedNotices)
        setLoading(false)
        return
      }

      // Fallback to API if no localStorage data
      const response = await fetch('/api/notices')
      const data = await response.json()
      
      if (response.ok) {
        setNotices(data.notices || [])
      } else {
        toast.error('Failed to fetch notices')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'text-red-600 bg-red-50'
      case 'academic': return 'text-blue-600 bg-blue-50'
      case 'administrative': return 'text-purple-600 bg-purple-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading notices...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notices</h1>
            <p className="text-gray-600">Stay updated with the latest announcements</p>
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
            value={filter.category}
            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Categories</option>
            <option value="general">General</option>
            <option value="academic">Academic</option>
            <option value="administrative">Administrative</option>
            <option value="emergency">Emergency</option>
          </select>
          <select
            value={filter.priority}
            onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {notices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notices found</h3>
            <p className="text-gray-600">Check back later for new announcements</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => (
              <Card key={notice._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg line-clamp-2">{notice.title}</CardTitle>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(notice.category)}`}>
                      {notice.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notice.priority)}`}>
                      {notice.priority}
                    </span>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(notice.publishedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">{notice.content}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      By {notice.author.username}
                    </span>
                    <Link href={`/notices/${notice._id}`}>
                      <Button variant="outline" size="sm">Read More</Button>
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
