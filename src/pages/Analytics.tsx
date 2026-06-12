import { TrendingUp } from 'lucide-react'

export default function Analytics() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track your performance and engagement metrics.</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-lg mb-6">
          <TrendingUp className="text-green-400" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Analytics Coming Soon</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Your analytics dashboard will appear here once you start posting
        </p>
      </div>
    </div>
  )
}
