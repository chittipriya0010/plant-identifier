import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ArtificialPlantCard({ plantInfo }) {
  return (
    <Card className="border-indigo-500/40 bg-indigo-950/15 animate-in fade-in duration-300">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="indigo">
            {plantInfo.artificialType || 'Plastic / Toy Plant'}
          </Badge>
          <span className="text-xs text-indigo-400 font-mono">
            Synthetic Model
          </span>
        </div>
        <CardTitle className="text-2xl text-white">
          {plantInfo.plantName || 'Artificial Plant'}
        </CardTitle>
        <CardDescription className="text-indigo-200/90 text-sm mt-1 leading-relaxed">
          {plantInfo.artificialNote ||
            'This is a synthetic or plastic toy decor plant. It has no biological care or medicinal properties.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {plantInfo.syntheticCues && plantInfo.syntheticCues.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
            <span className="font-semibold text-slate-300 block">
              Visual Detection Clues:
            </span>
            <ul className="space-y-1 text-slate-400">
              {plantInfo.syntheticCues.map((cue, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
