import React from 'react';
import { X, History, Trash2, Calendar, ShieldAlert, Sparkles, ChevronRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UI_TRANSLATIONS } from '@/lib/languages';

export function RecentScansModal({
  isOpen,
  onClose,
  history = [],
  onSelectScan,
  onClearHistory,
  language = 'en',
}) {
  if (!isOpen) return null;
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 id="history-title" className="text-base font-bold text-slate-900 dark:text-white">
                {t.history || 'Recent Scans'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {history.length} {t.scansCount || 'Scans'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-2.5">
          {history.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 flex items-center justify-center mb-3">
                <Leaf className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No scans recorded yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Scan your first botanical specimen or paste an image to build your catalog.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (onSelectScan) onSelectScan(item);
                  onClose();
                }}
                className="group p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-emerald-300 dark:hover:border-emerald-700/60 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all cursor-pointer flex items-center gap-3.5"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-200/60 dark:border-slate-700">
                  {item.preview ? (
                    <img
                      src={item.preview}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Leaf className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.isArtificial ? (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-50 text-amber-700 border-amber-200">
                        {t.artificial || 'Artificial'}
                      </Badge>
                    ) : item.isDangerous ? (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-rose-50 text-rose-700 border-rose-200">
                        {t.toxic || 'Caution'}
                      </Badge>
                    ) : item.isMedicinal ? (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-emerald-50 text-emerald-700 border-emerald-200">
                        {t.medicinal || 'Medicinal'}
                      </Badge>
                    ) : null}

                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              {t.clearAll || 'Clear All Scans'}
            </Button>
            <Button size="sm" variant="outline" onClick={onClose} className="text-xs">
              {t.close || 'Close'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentScansModal;
