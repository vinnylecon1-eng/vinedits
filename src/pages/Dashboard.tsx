import { BarChart3, TrendingUp, Users, Zap } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Mon', engagement: 400, reach: 2400 },
  { day: 'Tue', engagement: 600, reach: 2210 },
  { day: 'Wed', engagement: 800, reach: 2290 },
  { day: 'Thu', engagement: 1200, reach: 2000 },
  { day: 'Fri', engagement: 950, reach: 2181 },
  { day: 'Sat', engagement: 700, reach: 2500 },
  { day: 'Sun', engagement: 500, reach: 2100 },
]

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your performance overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: TrendingUp,
            label: 'Total Engagement',
            value: '12,450',
            change: '+23%',
            color: 'from-blue-500/20 to-blue-600/20',
          },
          {
            icon: Users,
            label: 'Followers',
            value: '45,230',
            change: '+12%',
            color: 'from-purple-500/20 to-purple-600/20',
          },
          {
            icon: Zap,
            label: 'Posts This Week',
            value: '12',
            change: '+4',
            color: 'from-yellow-500/20 to-yellow-600/20',
          },
          {
            icon: BarChart3,
            label: 'Avg Engagement Rate',
            value: '8.5%',
            change: '+2.1%',
            color: 'from-green-500/20 to-green-600/20',
          },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className={`bg-gradient-to-br ${stat.color} border border-border rounded-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <Icon className="text-primary" size={24} />
                <span className="badge-success text-xs">{stat.change}</span>
              </div>
              <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Engagement Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(20, 20, 30, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ fill: '#0ea5e9', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="reach"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Posts */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Recent Posts</h2>
          <div className="space-y-4">
            {[
              { title: 'Fitness Tips', engagement: 2450, platform: 'Instagram' },
              { title: 'Workout Video', engagement: 1890, platform: 'TikTok' },
              { title: 'Nutrition Guide', engagement: 1650, platform: 'YouTube' },
            ].map((post, i) => (
              <div key={i} className="p-3 bg-muted/50 rounded-lg">
                <p className="font-semibold text-sm mb-1">{post.title}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.platform}</span>
                  <span className="text-primary font-semibold">{post.engagement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2">Generate Content</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Create viral hooks, titles, and hashtags for your niche
          </p>
          <button className="btn-primary">Get Started</button>
        </div>

        <div className="bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2">Analyze Your Niche</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Understand your audience and optimal posting times
          </p>
          <button className="btn-primary">Analyze</button>
        </div>
      </div>
    </div>
  )
}
