export interface User {
  id: string
  email: string
  name: string
  subscription: 'free' | 'pro' | 'agency'
  createdAt: string
}

export interface GeneratedContent {
  id: string
  sourceUrl: string
  platform: string
  niche: string
  seoTitle: string
  hooks: string[]
  description: string
  caption: string
  hashtags: string[]
  thumbnailIdea: string
  clipDuration: string
  sourceDuration: number
  totalShorts: number
  shortIndex: number
  watermarkRemoved: boolean
  status: 'draft' | 'scheduled' | 'posted'
  scheduledAt: string | null
  createdAt: string
}

export interface ScheduledPost {
  id: string
  contentId: string
  seoTitle: string
  hashtags: string[]
  platform: string
  niche?: string
  sourceUrl: string
  scheduledAt: string
  status: 'pending' | 'posted' | 'failed'
  createdAt: string
}

export interface AnalyticsData {
  daily: { date: string; views: number; likes: number; comments: number; shares: number; saves: number }[]
  stats: {
    totalViews: number
    totalLikes: number
    totalComments: number
    totalShares: number
    totalSaves: number
    contentGenerated: number
    postsScheduled: number
    avgEngagementRate: number
  }
  topContent: { seoTitle: string; views: number; likes: number; platform: string; date: string }[]
  platformBreakdown: { platform: string; percentage: number }[]
}
