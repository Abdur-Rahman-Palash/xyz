'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  FileText, 
  Calendar, 
  Plus, 
  LogOut, 
  BarChart3, 
  Users,
  TrendingUp,
  Clock
} from 'lucide-react'

interface DashboardStats {
  totalNotices: number
  totalEvents: number
  upcomingEvents: number
  recentNotices: number
}

function AdminDashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    totalNotices: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    recentNotices: 0
  })
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchStats()
    
    // Check for refresh parameter and clear it
    if (searchParams.get('refresh') === 'true') {
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [])

  useEffect(() => {
    // Refresh stats every 10 seconds for more responsive real-time updates
    const statsInterval = setInterval(() => {
      fetchStats()
    }, 10000)

    return () => clearInterval(statsInterval)
  }, [])

  // Listen for storage events to detect when new items are created
  useEffect(() => {
    const handleStorageChange = (e: any) => {
      console.log('Storage changed:', e)
      fetchStats() // Immediate update when storage changes
    }

    // Listen for custom storage event
    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for visibility changes (user returns to tab)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        fetchStats() // Update when page becomes visible
      }
    })

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      document.removeEventListener('visibilitychange', handleStorageChange)
    }
  }, [])

  // Also check for storage changes on mount
  useEffect(() => {
    const checkInitialStorage = () => {
      const lastRefresh = localStorage.getItem('dashboard-refresh')
      if (lastRefresh) {
        console.log('Initial storage check - found refresh trigger')
        fetchStats()
        localStorage.removeItem('dashboard-refresh')
      }
    }

    checkInitialStorage()
  }, [])

  const fetchStats = async () => {
    try {
      // First try to get from localStorage for consistency with main website
      const storedNotices = JSON.parse(localStorage.getItem('notices') || '[]')
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]')
      
      if (storedNotices.length > 0 || storedEvents.length > 0) {
        const upcomingEvents = storedEvents.filter((event: any) => 
          event.status === 'upcoming'
        ).length || 0

        const recentNotices = storedNotices.filter((notice: any) => {
          const noticeDate = new Date(notice.publishedAt)
          const today = new Date()
          return noticeDate.toDateString() === today.toDateString()
        }).length || 0

        setStats({
          totalNotices: storedNotices.length,
          totalEvents: storedEvents.length,
          upcomingEvents,
          recentNotices
        })
        setLoading(false)
        return
      }

      // Fallback to API if no localStorage data
      const [noticesRes, eventsRes] = await Promise.all([
        fetch('/api/notices'),
        fetch('/api/events')
      ])

      const noticesData = await noticesRes.json()
      const eventsData = await eventsRes.json()

      const upcomingEvents = eventsData.events?.filter((event: any) => 
        event.status === 'upcoming'
      ).length || 0

      const recentNotices = noticesData.notices?.filter((notice: any) => {
        const noticeDate = new Date(notice.publishedAt)
        const today = new Date()
        return noticeDate.toDateString() === today.toDateString()
      }).length || 0

      setStats({
        totalNotices: noticesData.notices?.length || 0,
        totalEvents: eventsData.events?.length || 0,
        upcomingEvents,
        recentNotices
      })

      // Store API data in localStorage for consistency
      if (noticesData.notices && noticesData.notices.length > 0) {
        localStorage.setItem('notices', JSON.stringify(noticesData.notices))
      }
      if (eventsData.events && eventsData.events.length > 0) {
        localStorage.setItem('events', JSON.stringify(eventsData.events))
      }
    } catch (error) {
      toast.error('Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNotices}</div>
              <p className="text-xs text-muted-foreground">
                {stats.recentNotices} added today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                {stats.upcomingEvents} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentNotices}</div>
              <p className="text-xs text-muted-foreground">
                Notices today
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common administrative tasks
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => router.push('/admin/notices/new')}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Notice
                </Button>
                <Button 
                  onClick={() => router.push('/admin/events/new')}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Event
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => router.push('/admin/notices')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Manage Notices
                </Button>
                <Button 
                  onClick={() => router.push('/admin/events')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Manage Events
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>
                Current system status and statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Database Status</span>
                  </div>
                  <span className="text-sm font-medium">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">API Status</span>
                  </div>
                  <span className="text-sm font-medium">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Last Backup</span>
                  </div>
                  <span className="text-sm font-medium">Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading dashboard...</div>}>
      <AdminDashboardContent />
    </Suspense>
  )
}
