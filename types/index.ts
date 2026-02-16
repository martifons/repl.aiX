// Shared types — API-ready; swap mocks for real endpoints without changing UI.

export interface Tweet {
  id: string;
  author: string;
  username: string;
  avatar: string;
  followers: number;
  text: string;
  likes: number;
  replies: number;
  retweets: number;
  timestamp: string;
  createdAt?: string; // ISO date for filtering
}

export interface ReplyVersion {
  id: string;
  text: string;
  createdAt: string;
  isOriginal?: boolean;
}

export interface SavedReply {
  id: string;
  tweetId: string;
  tweet: Tweet;
  originalText: string;
  currentText: string;
  versions: ReplyVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface PerformedReply {
  id: string;
  tweetId: string;
  tweet: Tweet;
  replyText: string;
  postedAt: string;
  likesReceived: number;
  repliesReceived: number;
  retweetsReceived: number;
  engagementScore: number;
}

export type TimeRange = '7d' | '30d' | 'all';

export interface AnalyticsKPIs {
  followersGrowth: number;
  followersCurrent: number;
  repliesSentOverTime: number[];
  engagementReceivedOverTime: number[];
  replySuccessRate: number;
  bestPostingHours: number[];
  topKeywords: { keyword: string; count: number; engagement: number }[];
}

export interface FollowersChartPoint {
  date: string;
  followers: number;
}

export interface RepliesChartPoint {
  date: string;
  count: number;
}

export interface HeatmapCell {
  hour: number;
  dayOfWeek: number;
  value: number;
}

export interface UserProfile {
  name: string;
  username: string;
  email: string;
  avatar: string;
  plan: 'Trial' | 'Active' | 'Starter' | 'Pro' | 'Growth';
  followers: number;
  joinDate: string;
  repliesUsedToday: number;
  repliesLimit: number;
  totalRepliesSent: number;
  totalEngagementReceived: number;
}
