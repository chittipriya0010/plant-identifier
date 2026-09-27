import React, { useState, useEffect } from 'react';
import { RotateCw, X, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AnalysisProgress({ onCancel }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStageInfo = (s) => {
    if (s < 3) return { text: 'Optimizing and preparing image...', percent: 25 };
    if (s < 7) return { text: 'Scanning botanical structures & textures...', percent: 55 };
    if (s < 12) return { text: 'Querying Ayurvedic & toxicity databases...', percent: 80 };
    return { text: 'Finalizing pharmacological safety profile...', percent: 95 };
  };

  const stage = getStageInfo(seconds);

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-4 shadow-2xl animate-in fade-in duration-200">
      <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <Sparkles className="w-6 h-6 text-emerald-400 absolute" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Analyzing Plant Specimen
        </h3>
        <p className="text-xs text-slate-400 min-h-4">
          {stage.text}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800 max-w-xs mx-auto">
        <div
          className="bg-emerald-500 h-full transition-all duration-700 ease-out rounded-full"
          style={{ width: `${stage.percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 max-w-xs mx-auto pt-1">
        <span>Elapsed: {seconds}s</span>
        <span className="text-emerald-500 font-medium">Deep Botanical Reasoning</span>
      </div>

      {/* Cancel button to prevent indefinite loading */}
      <div className="pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="h-8 text-xs text-slate-400 border-slate-800 hover:text-white hover:border-slate-700 gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          <span>Cancel Scan</span>
        </Button>
      </div>
    </div>
  );
}
