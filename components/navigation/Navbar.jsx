import React from 'react';
import { Leaf, History, Globe, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '@/lib/languages';

export function Navbar({
  scanCount = 0,
  onOpenHistory,
  onOpenInstallApp,
  language = 'en',
  onLanguageChange,
}) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              Flora<span className="text-emerald-400">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-mono">
              {t.appSubtitle || 'Botanical Specimen Intelligence'}
            </span>
          </div>
        </div>

        {/* Actions: Get App + Language Selector + Scan History */}
        <div className="flex items-center gap-2">
          {/* Download App / APK Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenInstallApp}
            className="h-8 px-2.5 gap-1.5 text-xs text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-300 shadow-sm"
            title="Download FloraAI Android App (.apk)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.getApp || 'Get App (APK)'}</span>
            <span className="sm:hidden font-mono text-[10px]">APK</span>
          </Button>

          {/* International Language Dropdown */}
          <div className="relative flex items-center">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-200 hover:border-slate-700 transition-colors">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                value={language}
                onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
                aria-label="Select Application Language"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* History Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenHistory}
            className="h-8 px-2.5 gap-1.5 text-xs text-slate-300 border-slate-800 hover:bg-slate-900 hover:text-white"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.scansCount || 'Scans'} ({scanCount})</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
