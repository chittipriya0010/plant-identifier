import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Sparkles,
  Share2,
  ShieldCheck,
  Cpu,
  ArrowDownToLine,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UI_TRANSLATIONS } from '@/lib/languages';

export function InstallAppModal({ isOpen, onClose, language = 'en' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('apk'); // 'apk' or 'pwa'

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // Listen for native browser PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const handlePwaInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        language === 'hi'
          ? 'Apne browser ke 3 dots (⋮) par tap karein aur "Add to Home screen" ya "Install App" select karein!'
          : 'Tap your mobile browser menu (⋮) and tap "Add to Home screen" or "Install App"!'
      );
    }
  };

  const handleApkDownloadClick = () => {
    setDownloadStarted(true);
    setTimeout(() => setDownloadStarted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">FloraAI Mobile App</h2>
                <Badge variant="outline" className="text-[10px] px-2 py-0 border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
                  Android APK
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'hi' ? 'अपने फोन पर ऐप डाउनलोड और इंस्टॉल करें' : 'Install on Android Phone or Tablet'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Option Tabs */}
        <div className="px-4 pt-3 pb-1 border-b border-slate-900 flex gap-2">
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'apk'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'APK फाइल डाउनलोड' : 'Download APK File'}</span>
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'pwa'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? '1-Tap वेब ऐप (PWA)' : 'Instant PWA (No APK)'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto no-scrollbar space-y-4 text-xs">
          {activeTab === 'apk' ? (
            <div className="space-y-4">
              {/* Highlight Card */}
              <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-teal-950/30 border border-emerald-500/30 space-y-3 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>FloraAI Android Package (.apk)</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      {language === 'hi'
                        ? 'डायरेक्ट डाउनलोड करें और अपने फोन में किसी भी समय ऑफलाइन व ऑनलाइन यूज करें।'
                        : 'Standalone Android application package for direct installation on phones and tablets.'}
                    </p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                    v1.0 Release
                  </Badge>
                </div>

                {/* Specs Pill List */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-[10px]">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 text-center">
                    <span className="text-slate-400 block">{language === 'hi' ? 'कंपैटिबिलिटी' : 'Compatibility'}</span>
                    <span className="font-semibold text-slate-200">Android 7.0+</span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 text-center">
                    <span className="text-slate-400 block">{language === 'hi' ? 'फाइल साइज' : 'File Size'}</span>
                    <span className="font-semibold text-emerald-400">~15 MB</span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 text-center">
                    <span className="text-slate-400 block">{language === 'hi' ? 'सिक्योरिटी' : 'Security'}</span>
                    <span className="font-semibold text-teal-400">Verified Safe</span>
                  </div>
                </div>

                {/* Big Download Button */}
                <div className="pt-2">
                  <a
                    href="/downloads/flora-ai.apk"
                    download="flora-ai.apk"
                    onClick={handleApkDownloadClick}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25 transition-all transform active:scale-98 cursor-pointer"
                  >
                    <Download className="w-4 h-4 animate-bounce" />
                    <span>
                      {downloadStarted
                        ? (language === 'hi' ? 'APK डाउनलोड शुरू हो गया...' : 'Downloading flora-ai.apk...')
                        : (language === 'hi' ? 'FloraAI APK डाउनलोड करें (.apk)' : 'Download FloraAI APK (.apk)')}
                    </span>
                  </a>
                </div>
              </div>

              {/* Step by Step Install Guide */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'hi' ? 'फोन में इंस्टॉल करने के आसान स्टेप्स:' : 'How to Install APK on your Android Device:'}</span>
                </span>
                <ol className="space-y-2 text-[11px] text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      1
                    </span>
                    <span>
                      {language === 'hi'
                        ? 'ऊपर दिए गए "Download FloraAI APK" बटन पर टैप करें। फाइल डाउनलोड हो जाएगी।'
                        : 'Tap the green "Download FloraAI APK" button above to save flora-ai.apk.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      2
                    </span>
                    <span>
                      {language === 'hi'
                        ? 'डाउनलोड कम्प्लीट होने पर नोटिफिकेशन में "Open" पर क्लिक करें।'
                        : 'Once downloaded, tap the download notification or open your Downloads folder.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      3
                    </span>
                    <span>
                      {language === 'hi'
                        ? 'यदि फोन "Unknown sources" या "Allow from this source" मांगे, तो उसे "Allow" करें।'
                        : 'If Android prompts security notice, enable "Allow installation from this source".'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      4
                    </span>
                    <span>
                      {language === 'hi'
                        ? '"Install" दबाएं और FloraAI को सीधे अपनी होम स्क्रीन से इस्तेमाल करें!'
                        : 'Tap "Install" and enjoy FloraAI directly from your home screen!'}
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl p-4 bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-teal-400 font-bold">
                  <Layers className="w-4 h-4" />
                  <span>{language === 'hi' ? 'इंस्टेंट वेब ऐप (Zero Download)' : 'Instant PWA Installation'}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {language === 'hi'
                    ? 'बिना किसी APK फाइल को डाउनलोड किए, आप इसे सीधे अपने फोन की होम स्क्रीन पर एक नेटिव ऐप की तरह जोड़ सकते हैं। यह बहुत तेज है और ऑटो-अपडेट होता है।'
                    : 'Install directly without manually saving files. PWAs open in full-screen standalone mode with native camera and offline cache.'}
                </p>

                {isInstalled ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-xs">
                      {language === 'hi' ? 'FloraAI ऐप पहले से इंस्टॉल है!' : 'FloraAI is already installed!'}
                    </span>
                  </div>
                ) : (
                  <Button
                    onClick={handlePwaInstall}
                    variant="primaryGradient"
                    className="w-full py-3 text-xs font-bold"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    <span>{language === 'hi' ? 'होम स्क्रीन पर ऐप जोड़ें' : 'Add to Home Screen / Install Now'}</span>
                  </Button>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
                <span className="font-semibold text-slate-300">
                  {language === 'hi' ? 'मैन्युअल तरीका (Chrome / Safari):' : 'Manual Install Steps (Chrome / Safari):'}
                </span>
                <p>• <strong>Android Chrome:</strong> Top-right 3 dots (⋮) ➔ "Add to Home screen" / "Install app".</p>
                <p>• <strong>iPhone Safari:</strong> Bottom Share icon (⎋) ➔ "Add to Home Screen".</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? '100% सुरक्षित और वायरस-मुक्त' : '100% Secure & Virus Free'}</span>
          </span>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 text-xs text-slate-400 hover:text-white">
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </Button>
        </div>
      </div>
    </div>
  );
}
