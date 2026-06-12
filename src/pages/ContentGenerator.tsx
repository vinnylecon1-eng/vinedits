import { Zap } from 'lucide-react'

export default function ContentGenerator() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Content Generator</h1>
        <p className="text-muted-foreground">Generate viral hooks, titles, and hashtags for your content.</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-lg mb-6">
          <Zap className="text-accent" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Generate Content</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          First, analyze your niche to get personalized content recommendations
        </p>
        <button className="btn-primary">Go to Niche Analysis</button>
      </div>
    </div>
  )
}
