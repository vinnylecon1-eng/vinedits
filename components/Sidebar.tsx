'use client'

import { BarChart3, PlusCircle, Library, Clock, TrendingUp, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
  { icon: PlusCircle, label: 'Create Content', href: '/create' },
  { icon: Library, label: 'My Content', href: '/content' },
  { icon: Clock, label: 'Schedule', href: '/scheduled-posts' },
  { icon: TrendingUp, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export default function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onToggle} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-56 bg-surface border-r border-border transition-transform duration-200 flex flex-col ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-semibold text-sm">ViralAgent</span>
          </Link>
          <button onClick={onToggle} className="p-1 hover:bg-surface-2 rounded lg:hidden">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8"/></svg>
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => { if (window.innerWidth < 1024) onToggle() }}>
                <span className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${isActive ? 'bg-accent/10 text-accent font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'}`}>
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} />
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="p-3 rounded-lg bg-surface-2 border border-border">
            <p className="text-xs font-medium text-text-primary mb-1">Free Plan</p>
            <p className="text-[11px] text-text-tertiary mb-2.5">3 generations left</p>
            <button className="w-full py-1.5 text-xs font-medium bg-accent text-white rounded-md hover:bg-accent-hover transition-colors">Upgrade</button>
          </div>
        </div>
      </aside>
    </>
  )
}
