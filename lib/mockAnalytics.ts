export interface DayStat {
  day: string;
  replies: number;
  engagement: number;
  followersGained: number;
}

export interface AnalyticsSummary {
  repliesThisWeek: number;
  engagementGained: number;
  followersGrowth: number;
  bestDay: string;
  chartData: DayStat[];
}

const CHART_DATA: DayStat[] = [
  { day: 'Mon', replies: 12, engagement: 240, followersGained: 18 },
  { day: 'Tue', replies: 18, engagement: 320, followersGained: 22 },
  { day: 'Wed', replies: 14, engagement: 180, followersGained: 12 },
  { day: 'Thu', replies: 22, engagement: 410, followersGained: 28 },
  { day: 'Fri', replies: 19, engagement: 350, followersGained: 24 },
  { day: 'Sat', replies: 8, engagement: 120, followersGained: 8 },
  { day: 'Sun', replies: 15, engagement: 280, followersGained: 16 },
];

export function getMockAnalytics(): AnalyticsSummary {
  const repliesThisWeek = CHART_DATA.reduce((s, d) => s + d.replies, 0);
  const engagementGained = CHART_DATA.reduce((s, d) => s + d.engagement, 0);
  const followersGrowth = CHART_DATA.reduce((s, d) => s + d.followersGained, 0);
  const bestDay = CHART_DATA.reduce((a, b) => (a.engagement > b.engagement ? a : b)).day;

  return {
    repliesThisWeek,
    engagementGained,
    followersGrowth,
    bestDay,
    chartData: CHART_DATA,
  };
}
