import { useState, useEffect } from 'react'
import { Route, Switch } from 'wouter'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import NicheAnalysis from './pages/NicheAnalysis'
import ContentGenerator from './pages/ContentGenerator'
import ScheduledPosts from './pages/ScheduledPosts'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token')
    setIsAuthenticated(!!token)
  }, [])

  if (!isAuthenticated) {
    return (
      <>
        <Switch>
          <Route path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-auto">
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/niche-analysis" component={NicheAnalysis} />
            <Route path="/content-generator" component={ContentGenerator} />
            <Route path="/scheduled-posts" component={ScheduledPosts} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>

      <Toaster position="bottom-right" />
    </div>
  )
}
