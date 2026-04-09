'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, FileText, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function Home() {
  const [notices, setNotices] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    // Load data from localStorage
    const storedNotices = JSON.parse(localStorage.getItem('notices') || '[]')
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]')
    setNotices(storedNotices)
    setEvents(storedEvents)

    // Listen for storage changes
    const handleStorageChange = () => {
      const updatedNotices = JSON.parse(localStorage.getItem('notices') || '[]')
      const updatedEvents = JSON.parse(localStorage.getItem('events') || '[]')
      setNotices(updatedNotices)
      setEvents(updatedEvents)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex-1">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to XYZ
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Your comprehensive notice and event management system. Stay informed and connected with our organization.
          </p>
                  </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Notices</h2>
              </div>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                {notices.length}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Stay updated with the latest announcements and official notices from our organization.
            </p>
            <Link href="/notices">
              <Button className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                View Notices
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-indigo-600" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Events</h2>
              </div>
              <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium">
                {events.length}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Discover upcoming events, workshops, and activities happening in our community.
            </p>
            <Link href="/events">
              <Button className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                View Events
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
