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

export default function EditNoticePage({ params }: { params: { id: string } }) {
  const [notice, setNotice] = useState<Notice | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
    isActive: true
  })

  useEffect(() => {
    fetchNotice()
  }, [params.id])

  const fetchNotice = async () => {
    try {
      // First try to get from localStorage
      const storedNotices = JSON.parse(localStorage.getItem('notices') || '[]')
      const foundNotice = storedNotices.find((n: any) => n._id === params.id)
      
      if (foundNotice) {
        setNotice(foundNotice)
        setFormData({
          title: foundNotice.title,
          content: foundNotice.content,
          category: foundNotice.category,
          priority: foundNotice.priority,
          isActive: foundNotice.isActive
        })
        setLoading(false)
        return
      }

      // Fallback to API
      const response = await fetch(`/api/notices/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setNotice(data)
        setFormData({
          title: data.title,
          content: data.content,
          category: data.category,
          priority: data.priority,
          isActive: data.isActive
        })
      } else {
        toast.error(data.error || 'Notice not found')
        router.push('/admin/notices')
      }
    } catch (error) {
      toast.error('Failed to load notice')
      router.push('/admin/notices')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/notices/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Notice updated successfully!')
        
        // Update localStorage
        const storedNotices = JSON.parse(localStorage.getItem('notices') || '[]')
        const updatedNotices = storedNotices.map((n: any) => 
          n._id === params.id ? { ...n, ...formData } : n
        )
        localStorage.setItem('notices', JSON.stringify(updatedNotices))
        
        // Trigger storage event
        localStorage.setItem('dashboard-refresh', Date.now().toString())
        
        router.push('/admin/notices')
      } else {
        toast.error(data.error || 'Failed to update notice')
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
          <p className="text-gray-600">Loading notice...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/notices" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Manage Notices
          </Link>
          
          <Card>
            <CardHeader>
              <CardTitle>Edit Notice</CardTitle>
              <CardDescription>
                Update the notice information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
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
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    required
                    rows={6}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General</option>
                      <option value="academic">Academic</option>
                      <option value="administrative">Administrative</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      id="isActive"
                      value={formData.isActive ? 'active' : 'inactive'}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Link href="/admin/notices">
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
