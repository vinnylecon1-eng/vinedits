import { BarChart3, Brain, Zap, Clock, TrendingUp, Settings, X } from 'lucide-react'
import { Link, useLocation } from 'wouter'

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

const menuItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
  { icon: Brain, label: 'Niche Analysis', href: '/niche-analysis' },
  { icon: Zap, label: 'Content Generator', href: '/content-generator' },
  { icon: Clock, label: 'Scheduled Posts', href: '/scheduled-posts' },
  { icon: TrendingUp, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const [location] = useLocation()

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold gradient-text">Viral Agent</h2>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 hover:bg-muted rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location === item.href

            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </a>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 p-4 bg-gradient-bg rounded-lg border border-border">
          <p className="text-sm font-semibold mb-2">Pro Features</p>
          <p className="text-xs text-muted-foreground mb-4">
            Unlock unlimited posting and advanced analytics
          </p>
          <button className="w-full btn-primary text-sm">Upgrade Now</button>
        </div>
      </aside>
    </>
  )
}
