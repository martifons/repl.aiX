export interface MockTweet {
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
}

export const mockTweets: MockTweet[] = [
  { id: '1', author: 'Marc Lou', username: '@marc_lou', avatar: 'https://i.pravatar.cc/150?img=12', followers: 142000, text: 'Building in public is the best decision I made for my SaaS. Week 1: $0. Week 52: $50k MRR. The accountability is unreal.', likes: 2847, replies: 312, retweets: 892, timestamp: '2h' },
  { id: '2', author: 'Pieter Levels', username: '@levelsio', avatar: 'https://i.pravatar.cc/150?img=33', followers: 521000, text: 'AI will not replace indie hackers. Indie hackers who use AI will replace those who don\'t.', likes: 12400, replies: 890, retweets: 3200, timestamp: '3h' },
  { id: '3', author: 'Danny Postma', username: '@dannypostmaa', avatar: 'https://i.pravatar.cc/150?img=45', followers: 89000, text: 'Your first 100 users will come from Twitter. Your next 10,000 will come from product. Focus on both.', likes: 2100, replies: 156, retweets: 445, timestamp: '4h' },
  { id: '4', author: 'Sara', username: '@indie_sara', avatar: 'https://i.pravatar.cc/150?img=47', followers: 34000, text: 'Shipped my first SaaS in 3 weeks. No VC. No team. Just me and ChatGPT. Revenue: $2.3k this month. You don\'t need permission to build.', likes: 1890, replies: 203, retweets: 567, timestamp: '5h' },
  { id: '5', author: 'Arvid Kahl', username: '@arvidkahl', avatar: 'https://i.pravatar.cc/150?img=51', followers: 198000, text: 'The best marketing is a product people want to tell others about. Build that first.', likes: 4521, replies: 278, retweets: 1203, timestamp: '6h' },
  { id: '6', author: 'Marc Köhlbrugge', username: '@marckohlbrugge', avatar: 'https://i.pravatar.cc/150?img=60', followers: 67000, text: 'Startup idea: A tool that helps you reply to tweets with AI. Wait, someone is already building that. 👀', likes: 892, replies: 234, retweets: 156, timestamp: '7h' },
  { id: '7', author: 'Luna', username: '@buildwithluna', avatar: 'https://i.pravatar.cc/150?img=32', followers: 28000, text: 'Day 47 of building in public. MRR went from $0 to $4.2k. The secret? Consistency and replying to every single comment.', likes: 1567, replies: 189, retweets: 412, timestamp: '8h' },
  { id: '8', author: 'Daniel Vassallo', username: '@dvassallo', avatar: 'https://i.pravatar.cc/150?img=68', followers: 112000, text: 'Small bets beat big bets. 10 projects making $500/mo each > 1 project hoping for $5k/mo.', likes: 6234, replies: 445, retweets: 1890, timestamp: '9h' },
  { id: '9', author: 'Mitchell Harper', username: '@mitchharper', avatar: 'https://i.pravatar.cc/150?img=70', followers: 89000, text: 'SaaS tip: Your landing page has 3 seconds to answer "What does this do?" If it doesn\'t, you\'re losing 80% of visitors.', likes: 2340, replies: 167, retweets: 678, timestamp: '10h' },
  { id: '10', author: 'Rosie', username: '@rosie_creates', avatar: 'https://i.pravatar.cc/150?img=44', followers: 45000, text: 'Just hit $10k MRR as a solo founder. No paid ads. Just Twitter, SEO and a product people actually need.', likes: 3456, replies: 312, retweets: 890, timestamp: '11h' },
  { id: '11', author: 'James Clear', username: '@JamesClear', avatar: 'https://i.pravatar.cc/150?img=15', followers: 2100000, text: 'Consistency compounds more than people think. Reply to 5 tweets a day for a year. See what happens.', likes: 28900, replies: 1200, retweets: 5600, timestamp: '12h' },
  { id: '12', author: 'Lenny', username: '@lennysan', avatar: 'https://i.pravatar.cc/150?img=52', followers: 456000, text: 'Growth loop 101: Create content → Get followers → More people see your product → More signups → More testimonials → Better content.', likes: 7890, replies: 456, retweets: 2100, timestamp: '14h' },
  { id: '13', author: 'Kevon', username: '@kevoncheung', avatar: 'https://i.pravatar.cc/150?img=22', followers: 56000, text: 'The indie hacker community on X is the most supportive place on the internet. Pay it forward.', likes: 1234, replies: 198, retweets: 234, timestamp: '15h' },
  { id: '14', author: 'Anne', username: '@annereply', avatar: 'https://i.pravatar.cc/150?img=41', followers: 32000, text: 'AI replies are not lazy. They\'re smart. You focus on strategy; let AI handle the first draft. Then you add the human touch.', likes: 987, replies: 145, retweets: 267, timestamp: '16h' },
  { id: '15', author: 'Chris', username: '@chris_saas', avatar: 'https://i.pravatar.cc/150?img=58', followers: 78000, text: 'We went from 0 to 500 waitlist signups in 2 weeks. How? One viral tweet + a clear value prop. That\'s it.', likes: 2567, replies: 289, retweets: 734, timestamp: '18h' },
  { id: '16', author: 'Luca', username: '@lucabuilds', avatar: 'https://i.pravatar.cc/150?img=61', followers: 19000, text: 'Building in public isn\'t about showing off. It\'s about building in front of people who might become your first customers.', likes: 1456, replies: 178, retweets: 389, timestamp: '20h' },
  { id: '17', author: 'Mijha', username: '@mijha_ai', avatar: 'https://i.pravatar.cc/150?img=25', followers: 42000, text: 'The best SaaS ideas come from your own frustration. What do you wish existed? Build that.', likes: 2134, replies: 223, retweets: 512, timestamp: '22h' },
  { id: '18', author: 'Steph', username: '@steph_ships', avatar: 'https://i.pravatar.cc/150?img=43', followers: 67000, text: 'Shipped 12 products this year. 3 made money. 9 taught me something. All of them were worth it.', likes: 3789, replies: 334, retweets: 901, timestamp: '1d' },
  { id: '19', author: 'Nathan Latka', username: '@nlatta', avatar: 'https://i.pravatar.cc/150?img=55', followers: 234000, text: 'Top SaaS companies spend 40% of revenue on sales and marketing. If you\'re bootstrapped, your content is your sales team.', likes: 5678, replies: 412, retweets: 1456, timestamp: '1d' },
  { id: '20', author: 'Yongfook', username: '@yongfook', avatar: 'https://i.pravatar.cc/150?img=38', followers: 89000, text: 'Reply to 10 people a day in your niche. In 6 months you\'ll have a reputation. In 12 months you\'ll have a business.', likes: 2890, replies: 267, retweets: 678, timestamp: '2d' },
];
