import React from 'react';
import { Camera, UploadCloud, Clipboard, History, MessageSquare, Sparkles } from 'lucide-react';
import { UI_TRANSLATIONS } from '@/lib/languages';

export function MobileBottomBar({
  onCameraClick,
  onUploadClick,
  onPasteClick,
  onHistoryClick,
  onChatClick,
  historyCount = 0,
  hasResult = false,
  language = 'en',
}) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* Upload / Browse Button */}
        <button
          onClick={onUploadClick}
          className="flex flex-col items-center justify-center p-1.5 text-slate-600 dark:text-slate-400 active:scale-95 transition-transform"
          aria-label="Upload photo"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
            <UploadCloud className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium mt-1">{t.upload || 'Upload'}</span>
        </button>

        {/* Paste from Clipboard */}
        <button
          onClick={onPasteClick}
          className="flex flex-col items-center justify-center p-1.5 text-slate-600 dark:text-slate-400 active:scale-95 transition-transform"
          aria-label="Paste image"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
            <Clipboard className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium mt-1">{t.paste || 'Paste'}</span>
        </button>

        {/* Center Live Camera Floating Shutter */}
        <button
          onClick={onCameraClick}
          className="relative -top-3 flex flex-col items-center group active:scale-95 transition-transform"
          aria-label="Open live camera scanner"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
            <Camera className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
            {t.scan || 'Scan'}
          </span>
        </button>

        {/* History Button */}
        <button
          onClick={onHistoryClick}
          className="flex flex-col items-center justify-center p-1.5 text-slate-600 dark:text-slate-400 active:scale-95 transition-transform relative"
          aria-label="Scan history"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 relative">
            <History className="w-5 h-5" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-1">{t.history || 'History'}</span>
        </button>

        {/* Ask Dr. Flora Button */}
        <button
          onClick={onChatClick}
          className={`flex flex-col items-center justify-center p-1.5 active:scale-95 transition-transform relative ${
            hasResult
              ? 'text-teal-600 dark:text-teal-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400'
          }`}
          aria-label="Chat with Dr. Flora Botanist"
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center relative ${
              hasResult
                ? 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 ring-2 ring-teal-400/40'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            {hasResult && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
            )}
          </div>
          <span className="text-[10px] mt-1">{t.drFlora || 'Dr. Flora'}</span>
        </button>
      </div>
    </nav>
  );
}

export default MobileBottomBar;
