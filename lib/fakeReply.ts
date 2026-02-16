const REPLY_POOL: ((tweet: string) => string)[] = [
  () => "This is so true. We've seen the same pattern while building repl.aiX.",
  () => 'Consistency compounds more than people think.',
  (t) => `Great point about ${t.slice(0, 20)}... — totally agree.`,
  () => "Building in public changed everything for us. Couldn't recommend it more.",
  () => 'The indie community on X is unmatched. This is why we keep shipping.',
  () => "Same. We're 6 months in and the accountability alone is worth it.",
  () => "Love this. It's the small daily actions that add up.",
  () => 'Exactly. No need for permission — just build and share.',
  () => "Couldn't agree more. AI is a lever, not a replacement.",
  () => 'This. Your first 100 users will remember you showed up.',
  () => "We hit our first $1k MRR the same way. One reply at a time.",
  () => 'So underrated. Most people overthink and never ship.',
  () => "The best marketing is genuinely being helpful. This is it.",
  () => 'Same approach here. Consistency > virality every time.',
  () => "100%. We're seeing this with our users every day.",
  () => 'This is the way. Small bets, compound growth.',
  () => "Couldn't have said it better. Building in public works.",
  () => 'Facts. The reply game is underrated for growth.',
  () => "We're doing this right now. Day 47 and already seeing results.",
  () => 'The secret no one talks about. Thanks for sharing.',
];

export function generateFakeReply(tweetText: string): string {
  const idx = Math.floor(Math.random() * REPLY_POOL.length);
  return REPLY_POOL[idx](tweetText);
}
