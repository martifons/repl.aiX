'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import type { TimeRange } from '@/types';
import { getTopPerformingReplies } from '@/services/analyticsService';
import { seedPerformedRepliesIfNeeded } from '@/lib/mockSeedData';
import RequirePlan from '@/components/RequirePlan';
import { Card } from '@/components/ui/Card';
import { PageContainer, PageHeader } from '@/components/ui/PageContainer';
import { ScrollReveal } from '@/components/ScrollReveal';

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'all', label: 'All time' },
];

function TopPerformingPageContent() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    seedPerformedRepliesIfNeeded();
    setMounted(true);
  }, []);

  const list = useMemo(() => {
    if (!mounted) return [];
    return getTopPerformingReplies(timeRange);
  }, [timeRange, mounted]);

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        title="Top Performing"
        description="Your best replies and engagement ranking"
      />

      <div className="flex flex-wrap items-center gap-2">
        {TIME_RANGES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTimeRange(value)}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-300 ${
              timeRange === value
                ? 'border-[#0057FF] bg-[#0057FF]/12 text-[#0057FF] shadow-[0_0_20px_rgba(0,87,255,0.15)]'
                : 'border-white/60 bg-white/60 text-gray-600 hover:border-[#0057FF]/30 hover:bg-[#0057FF]/5 hover:text-[#0057FF]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="text-gray-500">No replies in this period. Post replies from the Tweets page to see them here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {list.map((item, index) => (
            <ScrollReveal key={item.id} delay={Math.min(index, 3) as 0 | 1 | 2 | 3}>
              <Card
                padding="lg"
                className={`metric-card-hover transition-all duration-300 ${index < 3 ? 'top-perform-badge border-[#0057FF]/20' : ''}`}
              >
                <div className="flex gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${index < 3 ? 'bg-[#0057FF]/20 text-[#0057FF] ring-2 ring-[#0057FF]/30' : 'bg-[#0057FF]/10 text-[#0057FF]'}`}>
                    #{index + 1}
                  </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span>Posted {new Date(item.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="mt-2 rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                    <p className="text-xs font-medium text-gray-500">Original tweet</p>
                    <p className="mt-0.5 text-sm text-gray-900">{item.tweet.text}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Image
                        src={item.tweet.avatar}
                        alt=""
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span className="text-xs text-gray-600">{item.tweet.author} {item.tweet.username}</span>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg border border-[#0057FF]/20 bg-[#0057FF]/5 p-3">
                    <p className="text-xs font-medium text-[#0057FF]">Your reply</p>
                    <p className="mt-0.5 text-sm text-gray-900">&ldquo;{item.replyText}&rdquo;</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <span className="font-medium text-gray-700">❤️ {item.likesReceived} likes</span>
                    <span className="text-gray-600">💬 {item.repliesReceived} replies</span>
                    <span className="text-gray-600">🔁 {item.retweetsReceived} retweets</span>
                    <span className="rounded-full bg-[#0057FF]/10 px-2 py-0.5 font-semibold text-[#0057FF]">
                      Engagement score: {item.engagementScore}
                    </span>
                  </div>
                </div>
              </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

export default function TopPerformingPage() {
  return (
    <RequirePlan>
      <TopPerformingPageContent />
    </RequirePlan>
  );
}
