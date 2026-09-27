import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function NonPlantCard({ plantInfo }) {
  return (
    <Card className="border-amber-500/40 bg-amber-950/15 animate-in fade-in duration-300">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <Badge variant="warning" className="mb-1.5">
            Not a Plant / पौधा नहीं है
          </Badge>
          <CardTitle className="text-xl">
            {plantInfo.detectedObject ? `Detected: ${plantInfo.detectedObject}` : 'Non-Plant Subject'}
          </CardTitle>
          <CardDescription className="text-amber-200/80 mt-1 leading-relaxed">
            {plantInfo.nonPlantInstructions ||
              'This photo does not contain botanical flora. Please scan a live leaf, flower, or plant.'}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
