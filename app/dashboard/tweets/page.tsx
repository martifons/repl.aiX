'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import type { Tweet } from '@/types';
import { getTweets } from '@/services/twitterService';
import { generateReply, getSavedReply, recordPostReply } from '@/services/replyService';
import { postReply } from '@/services/twitterService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import RequirePlan from '@/components/RequirePlan';
import { Card } from '@/components/ui/Card';
import { PageContainer, PageHeader } from '@/components/ui/PageContainer';
import { Button } from '@/components/ui/Button';
import { ReplyStudio } from '@/components/ReplyStudio';

type ReplyState = Record<string, 'idle' | 'loading' | 'done'>;

function TweetsPageContent() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [replyState, setReplyState] = useState<ReplyState>({});
  const [generatedReplies, setGeneratedReplies] = useState<Record<string, string>>({});
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    getTweets().then(setTweets);
  }, []);

  useEffect(() => {
    if (tweets.length === 0) return;
    const saved: Record<string, string> = {};
    tweets.forEach((t) => {
      const s = getSavedReply(t.id);
      if (s) {
        saved[t.id] = s.currentText;
        setReplyState((prev) => ({ ...prev, [t.id]: 'done' }));
      }
    });
    if (Object.keys(saved).length) setGeneratedReplies((r) => ({ ...r, ...saved }));
  }, [tweets]);

  const handleGenerateReply = useCallback(
    async (tweet: Tweet) => {
      if (user && user.repliesUsedToday >= user.repliesLimit) {
        showToast('Daily reply limit reached. Upgrade for more.', 'info');
        return;
      }
      const saved = getSavedReply(tweet.id);
      if (saved) {
        setGeneratedReplies((r) => ({ ...r, [tweet.id]: saved.currentText }));
        setReplyState((s) => ({ ...s, [tweet.id]: 'done' }));
        return;
      }
      setReplyState((s) => ({ ...s, [tweet.id]: 'loading' }));
      const reply = await generateReply(tweet.text, tweet.id);
      setGeneratedReplies((r) => ({ ...r, [tweet.id]: reply }));
      setReplyState((s) => ({ ...s, [tweet.id]: 'done' }));
      refreshUser();
      showToast('Reply generated');
    },
    [user, showToast, refreshUser]
  );

  const getInitialVersions = useCallback((tweetId: string) => {
    const saved = getSavedReply(tweetId);
    return saved?.versions ?? [];
  }, []);

  const handleSaved = useCallback(
    (tweetId: string) => (text: string) => {
      setGeneratedReplies((r) => ({ ...r, [tweetId]: text }));
      showToast('Reply saved');
    },
    [showToast]
  );

  const handlePosted = useCallback(
    (tweet: Tweet) => async (text: string) => {
      const result = await postReply(tweet.id, text);
      recordPostReply(tweet.id, tweet, text);
      if (result.success) {
        showToast('Reply posted to X');
      } else {
        showToast('Could not post to X. Check permissions (tweet.write).', 'error');
      }
      refreshUser();
    },
    [showToast, refreshUser]
  );

  if (tweets.length === 0) {
    return (
      <PageContainer className="space-y-6">
        <PageHeader title="Tweets" description="Find tweets and generate AI replies" />
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
          <span className="text-sm text-gray-500">Loading tweets…</span>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        title="Tweets"
        description="Find tweets and generate AI replies"
      />

      <div className="space-y-4">
        {tweets.map((tweet) => (
          <Card key={tweet.id} padding="md" className="metric-card-hover">
            <div className="flex gap-4">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gray-200">
                <Image src={tweet.avatar} alt="" width={44} height={44} className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-semibold text-gray-900">{tweet.author}</span>
                  <span className="text-sm text-gray-500">{tweet.username}</span>
                  <span className="text-sm text-gray-400">· {tweet.timestamp}</span>
                  {tweet.url && (
                    <a href={tweet.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0057FF] hover:underline ml-auto">
                      View on X →
                    </a>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-gray-500">{tweet.followers.toLocaleString()} followers</p>
                <p className="mt-2 text-gray-900 leading-snug">{tweet.text}</p>
                <div className="mt-3 flex gap-5 text-sm text-gray-500">
                  <span>❤️ {tweet.likes.toLocaleString()}</span>
                  <span>💬 {tweet.replies.toLocaleString()}</span>
                  <span>🔁 {tweet.retweets.toLocaleString()}</span>
                </div>

                <div className="mt-4">
                  {replyState[tweet.id] === 'loading' && (
                    <div className="flex items-center gap-2 rounded-xl bg-[#0057FF]/10 px-3 py-2.5 text-sm font-medium text-[#0057FF]">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0057FF] border-t-transparent" />
                      AI generating…
                    </div>
                  )}
                  {replyState[tweet.id] === 'done' && generatedReplies[tweet.id] && (
                    <div className="mt-4 space-y-4">
                      <ReplyStudio
                        tweet={tweet}
                        originalReply={generatedReplies[tweet.id]}
                        initialVersions={getInitialVersions(tweet.id)}
                        onSaved={handleSaved(tweet.id)}
                        onPosted={handlePosted(tweet)}
                        onUsageUpdate={refreshUser}
                      />
                    </div>
                  )}
                  {(replyState[tweet.id] === 'idle' || !replyState[tweet.id]) && (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => handleGenerateReply(tweet)}
                    >
                      Generate AI reply
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}

export default function TweetsPage() {
  return (
    <RequirePlan>
      <TweetsPageContent />
    </RequirePlan>
  );
}
