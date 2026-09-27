import React from 'react';
import { Camera, UploadCloud, Clipboard, Sparkles, X, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UI_TRANSLATIONS } from '@/lib/languages';

export function DropzoneSection({
  getRootProps,
  getInputProps,
  isDragActive,
  imagePreview,
  loading,
  onClearImage,
  onIdentify,
  onStartCamera,
  onOpenFilePicker,
  onPasteClick,
  language = 'en',
}) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <Card className="border-slate-800 bg-slate-900/60 shadow-xl overflow-hidden">
      <div
        {...getRootProps()}
        className={`p-6 sm:p-8 text-center transition-all ${
          isDragActive ? 'bg-emerald-950/20 border-emerald-500/50' : ''
        }`}
      >
        <input {...getInputProps()} />

        {!imagePreview ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Camera className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {t.dropzoneTitle || 'Capture, Drop, or Paste Plant Image'}
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {t.dropzoneDesc || (
                  <>
                    Drag & drop from files/browser, browse gallery, or press{' '}
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-400 font-mono text-[10px]">
                      Ctrl+V
                    </kbd>{' '}
                    to paste directly without downloading!
                  </>
                )}
              </p>
            </div>

            {/* Action Buttons Row */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 max-w-md mx-auto">
              <Button
                type="button"
                variant="primaryGradient"
                onClick={onStartCamera}
                className="w-full gap-1.5 shadow-emerald-500/15 text-xs h-10 px-2"
              >
                <Camera className="w-4 h-4 shrink-0" />
                <span>{t.camera || 'Camera'}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onOpenFilePicker}
                className="w-full gap-1.5 border-slate-700 hover:border-slate-500 text-xs h-10 px-2"
              >
                <UploadCloud className="w-4 h-4 shrink-0" />
                <span>{t.browse || 'Browse'}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onPasteClick}
                className="w-full gap-1.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs h-10 px-2"
                title="Paste image from clipboard (Ctrl + V)"
              >
                <Clipboard className="w-4 h-4 shrink-0" />
                <span>{t.paste || 'Paste'}</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative inline-block group">
              <img
                src={imagePreview}
                alt="Selected Plant"
                className="max-h-64 sm:max-h-80 w-auto mx-auto rounded-xl object-contain shadow-2xl border border-slate-700"
              />
              <button
                type="button"
                onClick={onClearImage}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 hover:bg-red-600 text-white transition-colors cursor-pointer"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-sm mx-auto">
              <Button
                type="button"
                variant="primaryGradient"
                onClick={onIdentify}
                disabled={loading}
                className="w-full h-12 text-sm font-semibold gap-2 shadow-emerald-500/20"
              >
                {loading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>{t.analyzingBtn || 'Analyzing Specimen...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t.identifyBtn || 'Identify & Analyze'}</span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onStartCamera}
                disabled={loading}
                className="w-full sm:w-auto h-12 border-slate-700"
              >
                <RotateCw className="w-4 h-4 mr-1.5" />
                <span>{t.retakeBtn || 'Retake'}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
