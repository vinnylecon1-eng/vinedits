'use client'

import { Menu, Bell, User as UserIcon, LogOut, Settings } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="h-14 border-b border-border/50 glass flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="p-1.5 hover:bg-surface-2 rounded-md transition-colors lg:hidden">
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center shadow-lg shadow-accent/20">
            <span className="text-white font-bold text-xs">V</span>
          </div>
          <span className="font-semibold text-sm hidden sm:block">Vinedits</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-1.5 hover:bg-surface-2 rounded-md transition-colors relative group">
          <Bell size={16} className="text-text-secondary group-hover:text-text-primary transition-colors" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 hover:bg-surface-2 rounded-md transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-accent to-indigo-500 rounded-md flex items-center justify-center">
              <UserIcon size={14} className="text-white" />
            </div>
            <span className="text-xs text-text-secondary hidden sm:block">{user?.name || 'User'}</span>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-1.5 w-44 bg-surface-2 border border-border rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-xs font-medium truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-text-tertiary truncate">{user?.email || ''}</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface transition-colors mx-1 rounded-md"
              >
                <Settings size={13} /> Settings
              </Link>
              <hr className="border-border my-1 mx-3" />
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface transition-colors mx-1 rounded-md"
              >
                <LogOut size={13} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
