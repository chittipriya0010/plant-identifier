import React, { useRef, useEffect, useState } from 'react';
import { Sprout, X, Send, Copy, Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '@/lib/languages';
import { ChatSkeletonLoader } from './ChatSkeletonLoader';

export function DoctorFloraDrawer({
  isOpen,
  onClose,
  plantInfo,
  messages,
  input,
  loading,
  isTranslating = false,
  language = 'en',
  onLanguageChange,
  onInputChange,
  onSendMessage,
}) {
  const chatScrollRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  // Language-specific suggestion chips
  const getSuggestions = (lang) => {
    switch (lang) {
      case 'hi':
        return [
          '☕ क्या इसका काढ़ा बना सकते हैं?',
          '💧 गर्मियों में कितना पानी दें?',
          '🐾 क्या यह पालतू जानवरों के लिए सुरक्षित है?',
          '🌿 इसके मुख्य औषधीय गुण क्या हैं?',
        ];
      case 'ur':
        return [
          '☕ کیا اس کا قہوہ یا جوشاندہ بنا سکتے ہیں؟',
          '💧 اس پودے کو کتنا پانی اور دھوپ درکار ہے؟',
          '🐾 کیا یہ پالتو جانوروں کے لیے نقصان دہ ہے؟',
          '🌿 اس کے روایتی طبی اور جڑی بوٹیوں کے فوائد کیا ہیں؟',
        ];
      case 'th':
        return [
          '☕ วิธีชงชาสมุนไพรจากพืชนี้?',
          '💧 ควรรดน้ำบ่อยแค่ไหนและโดนแดดอย่างไร?',
          '🐾 มีพิษต่อสุนัขหรือแมวหรือไม่?',
          '🌿 สรรพคุณทางยาและประโยชน์เด่นมีอะไรบ้าง?',
        ];
      case 'ms':
        return [
          '☕ Bagaimana cara membancuh teh herba?',
          '💧 Berapa kerap perlu disiram dan pencahayaan?',
          '🐾 Adakah beracun untuk kucing atau anjing?',
          '🌿 Apakah khasiat utama herba perubatan ini?',
        ];
      case 'tl':
        return [
          '☕ Paano maglaga o gumawa ng tsaang gamot?',
          '💧 Gaano kadalas dapat dililigawan at sikat ng araw?',
          '🐾 Lason ba ito para sa mga aso o pusa?',
          '🌿 Ano ang mga pangunahing benepisyong panggamot nito?',
        ];
      case 'ko':
        return [
          '☕ 약용 차나 허브 티로 끓이는 방법은?',
          '💧 물 주는 주기와 적정 일조량은?',
          '🐾 강아지나 고양이에게 독성이 있나요?',
          '🌿 주요 약효와 한방 효능은 무엇인가요?',
        ];
      case 'ja':
        return [
          '☕ 薬用ハーブティーの作り方は？',
          '💧 水やりの頻度と日当たりは？',
          '🐾 犬や猫に有毒ですか？',
          '🌿 主な薬効は何ですか？',
        ];
      case 'es':
        return [
          '☕ ¿Cómo preparar infusión medicinal?',
          '💧 ¿Frecuencia de riego y luz solar?',
          '🐾 ¿Es tóxica para perros o gatos?',
          '🌿 ¿Cuáles son sus propiedades medicinales?',
        ];
      case 'fr':
        return [
          '☕ Recette de tisane médicinale ?',
          '💧 Fréquence d\'arrosage et ensoleillement ?',
          '🐾 Est-elle toxique pour les animaux ?',
          '🌿 Quels sont ses bienfaits pour la santé ?',
        ];
      case 'de':
        return [
          '☕ Medizinische Zubereitung / Tee?',
          '💧 Wie oft gießen und Sonnenlicht?',
          '🐾 Giftig für Hunde oder Katzen?',
          '🌿 Was sind die Heileigenschaften?',
        ];
      case 'ar':
        return [
          '☕ كيف يتم تحضير شاي الأعشاب منه؟',
          '💧 ما هو جدول الري وضوء الشمس المناسب؟',
          '🐾 هل هذا النبات سام للقطط أو الكلاب؟',
          '🌿 ما هي أبرز الفوائد الطبية والعلاجية؟',
        ];
      case 'ru':
        return [
          '☕ Как заваривать лечебный чай или настой?',
          '💧 Как часто поливать и сколько нужно солнца?',
          '🐾 Токсично ли для кошек или собак?',
          '🌿 Каковы главные лечебные свойства?',
        ];
      default:
        return [
          '☕ How to brew medicinal tea / infusion?',
          '💧 Watering schedule and sunlight tips?',
          '🐾 Is this toxic for pet dogs or cats?',
          '🌿 Key health & Ayurvedic benefits?',
        ];
    }
  };

  const suggestions = getSuggestions(language);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md h-full bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                Dr. Flora
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono">
                  Botanist AI
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                {plantInfo?.plantName || 'Botanical Specimen'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher Pill */}
            {onLanguageChange && (
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value)}
                  className="bg-slate-800/90 text-slate-200 text-xs rounded-xl px-2 py-1 border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  title="Switch Language"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Message Stream */}
        <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3.5 text-xs">
          {isTranslating ? (
            <ChatSkeletonLoader language={language} />
          ) : (
            <>
              {messages.map((msg, i) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={i}
                    className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mb-1">
                        <Sprout className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`relative group max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-sm'
                          : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {!isUser && (
                        <div className="mt-1.5 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopy(msg.content, i)}
                            className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                            title="Copy answer"
                          >
                            {copiedIndex === i ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">{t.copied || 'Copied'}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>{t.copy || 'Copy'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Modern Chat Loading Style: Bouncing Typing Indicator Bubble */}
              {loading && (
                <div className="flex items-start gap-2.5 animate-in fade-in duration-200">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Sprout className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-slate-900 border border-slate-800/90 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                      <span className="text-[11px] text-slate-400 ml-2 font-mono">
                        {UI_TRANSLATIONS[language]?.typingText || 'Dr. Flora is thinking...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3.5 py-2.5 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-900 bg-slate-950/80">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSendMessage(item)}
              disabled={loading || isTranslating}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-[11px] text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/70 flex items-center gap-2">
          <input
            type="text"
            value={input}
            disabled={loading || isTranslating}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder={
              isTranslating
                ? (UI_TRANSLATIONS[language]?.translatingChat || 'Translating conversation...')
                : (UI_TRANSLATIONS[language]?.chatPlaceholder || 'Ask Dr. Flora anything about this plant...')
            }
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-60"
          />
          <Button
            size="icon"
            variant="primaryGradient"
            onClick={() => onSendMessage()}
            disabled={loading || isTranslating || !input?.trim()}
            className="h-9 w-9 rounded-xl shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
