'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, FileText, Calendar, User, Shield } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">X</span>
            </div>
            <span className="text-xl font-bold text-gray-900">XYZ</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/notices" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
            >
              <FileText className="w-4 h-4" />
              Notices
            </Link>
            <Link 
              href="/events" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
            >
              <Calendar className="w-4 h-4" />
              Events
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/admin/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <User className="w-4 h-4" />
                Admin
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/notices" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="w-4 h-4" />
                Notices
              </Link>
              <Link 
                href="/events" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar className="w-4 h-4" />
                Events
              </Link>
              <Link 
                href="/admin/login" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="w-4 h-4" />
                Admin Portal
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
