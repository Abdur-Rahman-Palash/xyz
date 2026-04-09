import Link from 'next/link'
import { Calendar, FileText, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex-1">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to XYZ
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your comprehensive notice and event management system. Stay informed and connected with our organization.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/notices" 
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-5 h-5" />
              View Notices
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/events" 
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              View Events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Notices</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Stay updated with the latest announcements and official notices from our organization.
            </p>
            <Link 
              href="/notices" 
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              Browse All Notices
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Events</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Discover upcoming events, workshops, and activities happening in our community.
            </p>
            <Link 
              href="/events" 
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              Browse All Events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
