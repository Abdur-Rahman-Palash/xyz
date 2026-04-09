'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FileText, Plus, Edit, Trash2, Eye, ArrowLeft } from 'lucide-react'

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
  isActive: boolean
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchNotices()
  }, [])

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
      setNotices(data.notices || [])
      
      // Store API data in localStorage for main website
      if (data.notices && data.notices.length > 0) {
        localStorage.setItem('notices', JSON.stringify(data.notices))
      }
    } catch (error) {
      toast.error('Failed to fetch notices')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) {
      return
    }

    try {
      const response = await fetch(`/api/notices/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Notice deleted successfully')
        
        // Remove from localStorage
        const storedNotices = JSON.parse(localStorage.getItem('notices') || '[]')
        const updatedNotices = storedNotices.filter((notice: any) => notice._id !== id)
        localStorage.setItem('notices', JSON.stringify(updatedNotices))
        
        // Trigger storage event for main website
        localStorage.setItem('dashboard-refresh', Date.now().toString())
        
        fetchNotices()
      } else {
        toast.error('Failed to delete notice')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading notices...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Notices</h1>
              <p className="text-gray-600">Create and manage organization notices</p>
            </div>
          </div>
          <Link href="/admin/notices/new">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Notice
            </Button>
          </Link>
        </div>

        {notices.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notices found</h3>
              <p className="text-gray-600 mb-4">Create your first notice to get started</p>
              <Link href="/admin/notices/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Notice
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <Card key={notice._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{notice.title}</CardTitle>
                      <div className="flex gap-2 flex-wrap mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(notice.category)}`}>
                          {notice.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notice.priority)}`}>
                          {notice.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${notice.isActive ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50'}`}>
                          {notice.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <CardDescription>
                        Published on {new Date(notice.publishedAt).toLocaleDateString()} by {notice.author.username}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/notices/${notice._id}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/notices/${notice._id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(notice._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 line-clamp-2">{notice.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
