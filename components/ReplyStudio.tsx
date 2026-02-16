'use client';

import { useState, useCallback } from 'react';
import type { Tweet } from '@/types';
import type { ReplyVersion } from '@/types';
import {
  generateReply,
  improveTone,
  shortenReply,
  makeMoreEngaging,
  addQuestionToReply,
  saveReplyForTweet,
} from '@/services/replyService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const MAX_CHARS = 280;

interface ReplyStudioProps {
  tweet: Tweet;
  originalReply: string;
  initialVersions?: ReplyVersion[];
  onSaved?: (text: string) => void;
  onPosted?: (text: string) => void;
  onUsageUpdate?: () => void;
}

export function ReplyStudio({
  tweet,
  originalReply,
  initialVersions = [],
  onSaved,
  onPosted,
  onUsageUpdate,
}: ReplyStudioProps) {
  const [currentText, setCurrentText] = useState(originalReply);
  const [versions, setVersions] = useState<ReplyVersion[]>(() => {
    if (initialVersions.length > 0) return initialVersions;
    return [
      {
        id: 'v1',
        text: originalReply,
        createdAt: new Date().toISOString(),
        isOriginal: true,
      },
    ];
  });
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const applyAndAppendVersion = useCallback(
    async (actionName: string, fn: (t: string) => Promise<string>) => {
      setLoadingAction(actionName);
      try {
        const next = await fn(currentText);
        setCurrentText(next);
        const newVersion: ReplyVersion = {
          id: `v_${Date.now()}`,
          text: next,
          createdAt: new Date().toISOString(),
        };
        setVersions((v) => [...v, newVersion]);
      } finally {
        setLoadingAction(null);
      }
    },
    [currentText]
  );

  const handleRegenerate = useCallback(async () => {
    setLoadingAction('Regenerate');
    try {
      const newReply = await generateReply(tweet.text, tweet.id);
      setCurrentText(newReply);
      const newVersion: ReplyVersion = {
        id: `v_${Date.now()}`,
        text: newReply,
        createdAt: new Date().toISOString(),
        isOriginal: true,
      };
      setVersions((v) => [newVersion, ...v.filter((x) => x.id !== newVersion.id)].slice(0, 10));
      onUsageUpdate?.();
    } finally {
      setLoadingAction(null);
    }
  }, [tweet.text, tweet.id, onUsageUpdate]);

  const handleSave = useCallback(() => {
    const toSave =
      versions.some((v) => v.text === currentText) ?
        versions
      : [
          ...versions,
          {
            id: `v_${Date.now()}`,
            text: currentText,
            createdAt: new Date().toISOString(),
          } as ReplyVersion,
        ];
    saveReplyForTweet(tweet.id, tweet, originalReply, currentText, toSave);
    onSaved?.(currentText);
  }, [tweet, originalReply, currentText, versions, onSaved]);

  const handlePost = useCallback(() => {
    onPosted?.(currentText);
  }, [currentText, onPosted]);

  const resetToOriginal = useCallback(() => {
    setCurrentText(originalReply);
  }, [originalReply]);

  const selectVersion = useCallback((v: ReplyVersion) => {
    setCurrentText(v.text);
  }, []);

  const charCount = currentText.length;
  const isOver = charCount > MAX_CHARS;

  return (
    <div className="editor-enter">
      <Card padding="lg" className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Reply Studio</h3>
      <div className="relative">
        <textarea
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Write or edit your reply…"
          maxLength={MAX_CHARS}
          rows={4}
          className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0057FF] focus:outline-none focus:ring-2 focus:ring-[#0057FF]/20"
        />
        <div className="mt-1 flex justify-end">
          <span
            className={`text-xs tabular-nums ${
              isOver ? 'font-medium text-red-600' : charCount >= 260 ? 'text-amber-600' : 'text-gray-400'
            }`}
          >
            {charCount} / {MAX_CHARS}
          </span>
        </div>
      </div>

        {/* Preview on X */}
        <div className="rounded-xl border border-[#0057FF]/15 bg-[#F7F9FC] p-3">
          <p className="mb-2 text-xs font-medium text-gray-500">Preview on X</p>
          <div className="flex gap-3 rounded-lg bg-white p-3 shadow-sm border border-gray-100">
            <div className="h-9 w-9 shrink-0 rounded-full bg-[#0057FF]/20" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5 text-sm">
                <span className="font-semibold text-gray-900">You</span>
                <span className="text-gray-400">@user</span>
              </div>
              <p className="mt-0.5 text-sm text-gray-700 leading-snug">
                {currentText || 'Your reply will appear here…'}
              </p>
            </div>
          </div>
        </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRegenerate}
          disabled={!!loadingAction}
        >
          {loadingAction === 'Regenerate' ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0057FF] border-t-transparent" />
              Regenerating…
            </span>
          ) : (
            'Regenerate reply'
          )}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => applyAndAppendVersion('Improve tone', improveTone)}
          disabled={!!loadingAction}
        >
          {loadingAction === 'Improve tone' ? '…' : 'Improve tone'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => applyAndAppendVersion('Shorten', shortenReply)}
          disabled={!!loadingAction}
        >
          {loadingAction === 'Shorten' ? '…' : 'Shorten'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => applyAndAppendVersion('Make more engaging', makeMoreEngaging)}
          disabled={!!loadingAction}
        >
          {loadingAction === 'Make more engaging' ? '…' : 'Make more engaging'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => applyAndAppendVersion('Add question', addQuestionToReply)}
          disabled={!!loadingAction}
        >
          {loadingAction === 'Add question' ? '…' : 'Add question'}
        </Button>
        <Button variant="ghost" size="sm" onClick={resetToOriginal}>
          Reset to original AI reply
        </Button>
      </div>

      {versions.length > 1 && (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">Version history</p>
          <div className="flex flex-wrap gap-1.5">
            {versions.slice(0, 8).map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => selectVersion(v)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                  v.text === currentText
                    ? 'border-[#0057FF] bg-[#0057FF]/10 text-[#0057FF]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                v{i + 1}
                {v.isOriginal ? ' (original)' : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        <Button variant="secondary" size="md" onClick={handleSave}>
          Save
        </Button>
        <Button variant="primary" size="md" onClick={handlePost} disabled={isOver}>
          Post to X
        </Button>
      </div>
      </Card>
    </div>
  );
}
