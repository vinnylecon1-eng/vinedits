'use client'

import { Menu, Bell, User as UserIcon, LogOut } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="p-1.5 hover:bg-surface-2 rounded-md transition-colors lg:hidden">
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">V</span>
          </div>
          <span className="font-semibold text-sm hidden sm:block">ViralAgent</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-1.5 hover:bg-surface-2 rounded-md transition-colors relative">
          <Bell size={16} className="text-text-secondary" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full" />
        </button>
        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 p-1.5 hover:bg-surface-2 rounded-md transition-colors">
            <div className="w-6 h-6 bg-accent/20 rounded-md flex items-center justify-center">
              <UserIcon size={14} className="text-accent" />
            </div>
            <span className="text-xs text-text-secondary hidden sm:block">{user?.name || 'User'}</span>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-1.5 w-44 bg-surface-2 border border-border rounded-lg shadow-lg z-50 py-1">
              <Link href="/settings" className="block px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface transition-colors">Settings</Link>
              <hr className="border-border my-1" />
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface transition-colors flex items-center gap-2">
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
