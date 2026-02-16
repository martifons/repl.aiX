export interface ActivityItem {
  id: string;
  type: 'reply' | 'likes' | 'tweet_found';
  text: string;
  time: string;
  meta?: string;
}

export const mockActivity: ActivityItem[] = [
  { id: '1', type: 'reply', text: 'You replied to @levelsio', time: '5 min ago', meta: '24 likes' },
  { id: '2', type: 'likes', text: 'Your reply got 24 likes', time: '12 min ago' },
  { id: '3', type: 'tweet_found', text: 'New tweet found for you', time: '28 min ago', meta: 'SaaS · Building in public' },
  { id: '4', type: 'reply', text: 'You replied to @marc_lou', time: '1h ago', meta: '12 likes' },
  { id: '5', type: 'likes', text: 'Your reply got 8 likes', time: '2h ago' },
  { id: '6', type: 'tweet_found', text: 'New tweet found for you', time: '3h ago', meta: 'AI · Indie' },
  { id: '7', type: 'reply', text: 'You replied to @arvidkahl', time: '4h ago', meta: '31 likes' },
];
