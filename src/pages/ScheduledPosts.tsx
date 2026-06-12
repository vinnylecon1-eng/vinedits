import { Clock } from 'lucide-react'

export default function ScheduledPosts() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Scheduled Posts</h1>
        <p className="text-muted-foreground">Manage your scheduled posts and auto-posting settings.</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-lg mb-6">
          <Clock className="text-primary" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Scheduled Posts</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Generate content and schedule posts to see them here
        </p>
        <button className="btn-primary">Generate & Schedule</button>
      </div>
    </div>
  )
}
