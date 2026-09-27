import React from 'react';
import { RotateCw, X, Leaf, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CameraModal({
  videoRef,
  cameraError,
  onFlipCamera,
  onStopCamera,
  onCapture,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-between p-4 safe-area-bottom">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between px-2 pt-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={onFlipCamera}
          className="rounded-full bg-black/60 text-white border-0"
          title="Flip camera"
        >
          <RotateCw className="w-5 h-5" />
        </Button>
        <span className="text-xs text-white/70 font-mono tracking-widest uppercase">
          Plant Alignment View
        </span>
        <Button
          variant="secondary"
          size="icon"
          onClick={onStopCamera}
          className="rounded-full bg-black/60 text-white border-0"
          title="Close camera"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Viewfinder Video Stream with Leaf Outline Reticle */}
      <div className="relative w-full max-w-sm aspect-3/4 rounded-3xl overflow-hidden border border-white/20 bg-slate-950 shadow-2xl flex items-center justify-center my-auto">
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className="w-full h-full object-cover"
        />

        {/* Center Target Outline */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
          <div className="w-52 h-52 border-2 border-emerald-400/80 border-dashed rounded-3xl animate-pulse flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <Leaf className="w-12 h-12 text-emerald-400/40" />
          </div>
        </div>

        {cameraError && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
            <p className="text-xs text-slate-200">{cameraError}</p>
            <Button variant="secondary" size="sm" onClick={onStopCamera}>
              Close Viewfinder
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Shutter Controls */}
      <div className="w-full flex items-center justify-center pb-6">
        <button
          type="button"
          onClick={onCapture}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 shadow-2xl active:scale-90 transition-all cursor-pointer"
          title="Capture Specimen"
        >
          <div className="w-16 h-16 rounded-full bg-white/20" />
        </button>
      </div>
    </div>
  );
}
