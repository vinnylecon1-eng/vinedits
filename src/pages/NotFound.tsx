import { Link } from 'wouter'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl font-semibold mb-2">Page Not Found</p>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
        
        <Link href="/dashboard">
          <a className="inline-flex items-center gap-2 btn-primary">
            <ArrowLeft size={16} />
            Back to Dashboard
          </a>
        </Link>
      </div>
    </div>
  )
}
