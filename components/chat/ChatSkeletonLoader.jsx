import React from 'react';
import { Sprout, Sparkles, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '@/lib/languages';

export function ChatSkeletonLoader({ language = 'en' }) {
  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || {
    name: 'Selected Language',
    flag: '🌐',
  };

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const statusLabel = t.translatingChat || `Translating conversation to ${langObj.name}...`;

  return (
    <div className="space-y-4 py-2 animate-in fade-in duration-300">
      {/* Floating Status Pill */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] shadow-sm animate-pulse">
          <Globe className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          <span className="font-medium">
            {langObj.flag} {statusLabel}
          </span>
        </div>
      </div>

      {/* User Message Skeleton (Right-Aligned) */}
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-br-sm px-4 py-3 bg-gradient-to-r from-emerald-950/40 via-teal-900/30 to-emerald-900/40 border border-emerald-500/20 shadow-sm space-y-2">
          <div className="h-3 bg-emerald-400/25 rounded-full animate-pulse w-36" />
          <div className="h-2.5 bg-emerald-400/15 rounded-full animate-pulse w-24" />
        </div>
      </div>

      {/* Dr. Flora Response Skeleton (Left-Aligned) */}
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-emerald-500/20 animate-pulse">
          <Sprout className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 max-w-[85%] rounded-2xl rounded-tl-sm p-4 bg-slate-900/90 border border-slate-800/90 space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <div className="h-3 bg-emerald-500/30 rounded-full animate-pulse w-28" />
            <div className="h-2 bg-slate-700/60 rounded-full animate-pulse w-14" />
          </div>
          <div className="h-2.5 bg-slate-800 rounded-full animate-pulse w-full" />
          <div className="h-2.5 bg-slate-800 rounded-full animate-pulse w-11/12" />
          <div className="h-2.5 bg-slate-800 rounded-full animate-pulse w-4/5" />
          <div className="h-2 bg-slate-800/70 rounded-full animate-pulse w-3/5" />
        </div>
      </div>

      {/* Secondary User Question & Reply Skeleton */}
      <div className="flex justify-end opacity-75">
        <div className="max-w-[65%] rounded-2xl rounded-br-sm px-3.5 py-2.5 bg-gradient-to-r from-emerald-950/30 to-teal-900/20 border border-emerald-500/15">
          <div className="h-2.5 bg-emerald-400/20 rounded-full animate-pulse w-28" />
        </div>
      </div>

      <div className="flex items-start gap-2.5 opacity-75">
        <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
          <Sprout className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 max-w-[80%] rounded-2xl rounded-tl-sm p-3.5 bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="h-2.5 bg-slate-800 rounded-full animate-pulse w-full" />
          <div className="h-2.5 bg-slate-800 rounded-full animate-pulse w-3/4" />
        </div>
      </div>

      {/* Subtle Bottom Processing Note */}
      <div className="text-center pt-1">
        <span className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" />
          Preserving conversation thread in-place...
        </span>
      </div>
    </div>
  );
}
