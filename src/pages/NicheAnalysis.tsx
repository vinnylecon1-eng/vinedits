import { Brain, Loader } from 'lucide-react'

export default function NicheAnalysis() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Niche Analysis</h1>
        <p className="text-muted-foreground">Analyze your account to understand your niche and audience.</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-lg mb-6">
          <Brain className="text-primary" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Connect Your Account</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Connect your social media accounts to get started with niche analysis
        </p>
        <button className="btn-primary">Connect Account</button>
      </div>
    </div>
  )
}
