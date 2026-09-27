import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Sparkles, ShieldCheck } from 'lucide-react';

export function PlantSkeletonCard() {
  return (
    <Card className="border-slate-800 bg-slate-900/60 shadow-2xl overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <CardHeader className="space-y-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-28 bg-slate-800 rounded-full" />
            <div className="h-6 w-20 bg-slate-800/60 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-slate-800 rounded-xl" />
            <div className="h-8 w-8 bg-slate-800 rounded-xl" />
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <div className="h-7 w-52 bg-slate-800 rounded-lg" />
          <div className="h-4 w-36 bg-slate-800/60 rounded" />
        </div>

        {/* Status badges skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
          <div className="h-16 bg-slate-800/50 rounded-xl border border-slate-800/60" />
          <div className="h-16 bg-slate-800/50 rounded-xl border border-slate-800/60" />
          <div className="h-16 bg-slate-800/50 rounded-xl border border-slate-800/60 col-span-2 sm:col-span-1" />
        </div>
      </CardHeader>

      {/* Tabs Skeleton */}
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="flex gap-2 border-b border-slate-800 pb-3">
          <div className="h-9 w-32 bg-slate-800 rounded-xl" />
          <div className="h-9 w-32 bg-slate-800/50 rounded-xl" />
          <div className="h-9 w-28 bg-slate-800/50 rounded-xl hidden sm:block" />
        </div>

        <div className="space-y-3 pt-2">
          <div className="h-4 w-full bg-slate-800/60 rounded" />
          <div className="h-4 w-5/6 bg-slate-800/50 rounded" />
          <div className="h-4 w-4/6 bg-slate-800/40 rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="h-24 bg-slate-800/40 rounded-2xl border border-slate-800/50" />
          <div className="h-24 bg-slate-800/40 rounded-2xl border border-slate-800/50" />
        </div>
      </CardContent>
    </Card>
  );
}
