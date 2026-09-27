import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Head from 'next/head';
import { AlertCircle, AlertTriangle, Sparkles, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Modular Components
import { Navbar } from '@/components/navigation/Navbar';
import { MobileBottomBar } from '@/components/navigation/MobileBottomBar';
import { DropzoneSection } from '@/components/scanner/DropzoneSection';
import { AnalysisProgress } from '@/components/scanner/AnalysisProgress';
import { PlantResults } from '@/components/results/PlantResults';
import { CameraModal } from '@/components/camera/CameraModal';
import { DoctorFloraDrawer } from '@/components/chat/DoctorFloraDrawer';
import { RecentScansModal } from '@/components/history/RecentScansModal';
import { InstallAppModal } from '@/components/app/InstallAppModal';

import { PlantSkeletonCard } from '@/components/results/PlantSkeletonCard';

// Utilities
import { compressImage } from '@/lib/imageUtils';
import { SHOWCASE_SAMPLES, getShowcaseSamples } from '@/lib/sampleShowcaseData';
import { UI_TRANSLATIONS, SUPPORTED_LANGUAGES, getDoctorFloraGreeting } from '@/lib/languages';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showInstallAppModal, setShowInstallAppModal] = useState(false);
  const [language, setLanguage] = useState('en');

  // Conversational LLM Botanist (Dr. Flora) state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Multi-language translation cache, chat ref, and specimen tracker
  const translationCacheRef = useRef({});
  const currentSpecimenKeyRef = useRef(null);
  const chatMessagesRef = useRef(chatMessages);

  useEffect(() => {
    chatMessagesRef.current = chatMessages;
  }, [chatMessages]);

  // Load language from localStorage
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('flora_ai_language');
      if (savedLang) setLanguage(savedLang);
    } catch (e) {}
  }, []);

  const handleLanguageChange = async (newLang) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('flora_ai_language', newLang);
    } catch (e) {}

    // If no plant is currently scanned, nothing to translate
    if (!plantInfo) return;

    const currentChat = chatMessagesRef.current;
    const hasActiveChat = currentChat && currentChat.length > 1;

    const specimenKey = currentSpecimenKeyRef.current || plantInfo.plantName || plantInfo.detectedObject || 'specimen';
    const cacheKey = `${specimenKey}_${newLang}`;

    const targetGreeting = getDoctorFloraGreeting(plantInfo.plantName || plantInfo.detectedObject, newLang);

    // Fast initial greeting update ONLY if user has not engaged in chat yet
    if (!hasActiveChat) {
      setChatMessages([{ role: 'model', content: targetGreeting }]);
    }

    // Check if translation already exists in cache
    if (translationCacheRef.current[cacheKey]) {
      const cached = translationCacheRef.current[cacheKey];
      if (cached.plantInfo) setPlantInfo(cached.plantInfo);

      // Only restore cached chat if user is still at greeting level
      if (!hasActiveChat) {
        if (cached.chatMessages && cached.chatMessages.length > 0) {
          setChatMessages(cached.chatMessages);
        }
        return;
      }
      // If user has an active multi-turn conversation, do NOT wipe with 1-message cached greeting!
      // Instead, we proceed below to translate currentChat in-place!
    }

    // Call /api/translate-results to dynamically translate the botanical results & chat log in-place
    setIsTranslating(true);
    try {
      const messagesToTranslate = hasActiveChat
        ? currentChat
        : [{ role: 'model', content: targetGreeting }];

      const res = await fetch('/api/translate-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLanguage: newLang,
          plantInfo,
          chatMessages: messagesToTranslate,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.translatedPlantInfo) {
          setPlantInfo(data.translatedPlantInfo);
        }
        if (data.translatedChatMessages && data.translatedChatMessages.length > 0) {
          // Seamless in-place update of all chat messages (both user questions & bot answers) without refreshing!
          setChatMessages(data.translatedChatMessages);
        }

        // Cache the translated specimen and conversation
        translationCacheRef.current[cacheKey] = {
          plantInfo: data.translatedPlantInfo || plantInfo,
          chatMessages: data.translatedChatMessages || (hasActiveChat ? currentChat : [{ role: 'model', content: targetGreeting }]),
        };
      }
    } catch (err) {
      console.warn('Dynamic language translation error:', err.message);
    } finally {
      setIsTranslating(false);
    }
  };

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // Abort controller ref to cancel in-flight API requests
  const abortControllerRef = useRef(null);
  const userCancelledRef = useRef(false);

  // Live Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('environment');
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Load scan history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('flora_ai_scan_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load scan history:', e);
    }
  }, []);

  // Lock background scroll when drawer or modal is open to keep view pristine
  useEffect(() => {
    if (isChatOpen || showHistoryModal || isCameraOpen || showInstallAppModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isChatOpen, showHistoryModal, isCameraOpen, showInstallAppModal]);

  const saveToHistory = (info, previewUrl) => {
    if (!info) return;
    try {
      const newItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        name: info.plantName || info.detectedObject || 'Unknown Specimen',
        classification: info.classification,
        isMedicinal: info.isMedicinal,
        isDangerous: info.isDangerous,
        isArtificial: info.isArtificial || info.classification === 'plastic_or_toy_plant',
        preview: previewUrl,
        fullData: info,
      };
      const updated = [newItem, ...history.filter((h) => h.name !== newItem.name)].slice(0, 15);
      setHistory(updated);
      localStorage.setItem('flora_ai_scan_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save scan history:', e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('flora_ai_scan_history');
    } catch (e) {}
  };

  const handleSelectHistoryScan = (item) => {
    if (item.preview) setImagePreview(item.preview);
    if (item.fullData) setPlantInfo(item.fullData);
    setError(null);
    currentSpecimenKeyRef.current = item.name;
    const greeting = getDoctorFloraGreeting(item.name, language);
    setChatMessages([
      {
        role: 'model',
        content: greeting,
      },
    ]);
  };

  // Instant Showcase / Client Demo preset loader
  const handleLoadShowcase = (sample) => {
    setImagePreview(sample.preview);
    setPlantInfo(sample.data);
    setError(null);
    saveToHistory(sample.data, sample.preview);
    currentSpecimenKeyRef.current = sample.id;

    const greeting = getDoctorFloraGreeting(sample.label, language);
    const initialMsgs = [{ role: 'model', content: greeting }];
    setChatMessages(initialMsgs);

    // Seed English translation cache
    translationCacheRef.current[`${sample.id}_en`] = {
      plantInfo: sample.data,
      chatMessages: [{ role: 'model', content: getDoctorFloraGreeting(sample.label, 'en') }],
    };

    // If current language is not English, immediately translate preset to active language
    if (language !== 'en') {
      handleLanguageChange(language);
    }
  };

  // Process image file and compress
  const processImageFile = useCallback(async (file) => {
    if (!file) return;
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const compressed = await compressImage(e.target.result);
      setImagePreview(compressed);
      setPlantInfo(null);
      setError(null);
      setChatMessages([]);
    };
    reader.readAsDataURL(file);
  }, []);

  // Dropzone file drop handler
  const onDrop = useCallback(
    async (acceptedFiles, fileRejections, event) => {
      let file = acceptedFiles[0];

      // Dragged directly from web browser / external image URL
      if (!file && event?.dataTransfer?.items) {
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
          const item = event.dataTransfer.items[i];
          if (item.kind === 'file' && item.type.startsWith('image/')) {
            file = item.getAsFile();
            break;
          }
        }
      }

      if (file) {
        await processImageFile(file);
      }
    },
    [processImageFile]
  );

  // Global Clipboard Paste (Ctrl+V) listener
  useEffect(() => {
    const handleGlobalPaste = async (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }
      if (!e.clipboardData?.items) return;

      for (let i = 0; i < e.clipboardData.items.length; i++) {
        const item = e.clipboardData.items[i];
        if (item.type?.startsWith('image/')) {
          const blob = item.getAsFile();
          if (blob) {
            e.preventDefault();
            await processImageFile(blob);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [processImageFile]);

  // Paste button click
  const handlePasteButtonClick = async () => {
    try {
      if (navigator.clipboard?.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              const blob = await item.getType(type);
              await processImageFile(blob);
              return;
            }
          }
        }
      }
      alert('Clipboard me koi image nahi mili. Kisi plant photo ko copy karein aur Ctrl+V press karein.');
    } catch (err) {
      alert('Aap keyboard par direct Ctrl + V (or Cmd + V) press karke copied image paste kar sakte hain!');
    }
  };

  const { getRootProps, getInputProps, isDragActive, open: openFilePicker } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  // Camera Controls
  const startCamera = async (facing = cameraFacing) => {
    setCameraError(null);
    setIsCameraOpen(true);

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
    }

    try {
      const constraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera stream error:', err);
      setCameraError('Camera access denied or unavailable. Please use file upload.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const flipCamera = () => {
    const next = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(next);
    startCamera(next);
  };

  const captureSnapshot = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const compressed = await compressImage(canvas.toDataURL('image/jpeg', 0.85));
    stopCamera();
    setImagePreview(compressed);
    setSelectedImage(compressed);
    setPlantInfo(null);
    setError(null);
    setChatMessages([]);
  };

  // Identify Plant API call with strict client timeout and user cancellation
  const identifyPlant = async () => {
    if (!imagePreview) return;
    setLoading(true);
    setError(null);
    userCancelledRef.current = false;

    // Create an AbortController with generous 45s safety timeout
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 45000);

    try {
      const res = await fetch('/api/identify-plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: imagePreview, language }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        if (res.status === 504 || res.status === 408) {
          throw new Error('AI server response timed out due to high network traffic. Please tap "Identify & Analyze" again to retry.');
        }
        throw new Error(d.error || 'Failed to identify plant. Please try again.');
      }

      const result = await res.json();
      setPlantInfo(result);
      saveToHistory(result, imagePreview);

      const specimenKey = result.plantName || result.detectedObject || ('specimen_' + Date.now());
      currentSpecimenKeyRef.current = specimenKey;

      // Preload botanist greeting in active language
      const greeting = getDoctorFloraGreeting(result.plantName || result.detectedObject, language);
      const initialMsgs = [{ role: 'model', content: greeting }];
      setChatMessages(initialMsgs);

      // Seed translation cache for current language
      translationCacheRef.current[`${specimenKey}_${language}`] = {
        plantInfo: result,
        chatMessages: initialMsgs,
      };
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        if (userCancelledRef.current) {
          setError('Scan was cancelled.');
        } else {
          setError('The AI request took longer than expected due to server traffic. Please tap "Identify & Analyze" to retry.');
        }
      } else {
        setError(err.message || 'Error occurred while scanning. Please try again.');
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  // User manually cancels scan via button
  const handleCancelScan = () => {
    userCancelledRef.current = true;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
  };

  // Send message to Dr. Flora Botanist LLM
  const sendChatMessage = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : chatInput;
    if (!query || !query.trim() || chatLoading) return;

    const newMsgs = [...chatMessages, { role: 'user', content: query.trim() }];
    setChatMessages(newMsgs);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat-botanist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantContext: plantInfo,
          messages: newMsgs,
          language,
        }),
      });

      if (!res.ok) throw new Error('Botanist AI is currently busy.');
      const data = await res.json();
      setChatMessages([...newMsgs, { role: 'model', content: data.reply }]);
    } catch (err) {
      setChatMessages([
        ...newMsgs,
        { role: 'model', content: 'Connection issue. Please ask again.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Audio Speech Synthesis
  const toggleSpeech = () => {
    if (!plantInfo || typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let speechText = '';
    if (plantInfo.classification === 'not_a_plant') {
      speechText = `This does not appear to be a plant. Detected object: ${plantInfo.detectedObject || 'non-botanical item'}. Please upload a real plant photo.`;
    } else if (plantInfo.isArtificial || plantInfo.classification === 'plastic_or_toy_plant') {
      speechText = `Identified as an artificial or toy plant. It is synthetic with no natural medicinal properties.`;
    } else {
      speechText = `${plantInfo.plantName}, scientifically known as ${plantInfo.scientificName || ''}. Safety status: ${plantInfo.dangerLevel || 'Safe'}. ${plantInfo.isMedicinal ? 'It possesses medicinal properties.' : ''} ${plantInfo.generalInfo || ''}`;
    }

    const u = new SpeechSynthesisUtterance(speechText);
    u.rate = 0.95;
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setIsSpeaking(true);
  };

  // Copy Summary to clipboard
  const copySummary = () => {
    if (!plantInfo) return;
    const txt = `🌿 Plant: ${plantInfo.plantName || 'Unknown'} (${plantInfo.scientificName || ''})\n` +
      `🛡️ Safety: ${plantInfo.dangerLevel || 'Safe'}\n` +
      `💊 Medicinal: ${plantInfo.isMedicinal ? 'Yes' : 'No'}\n` +
      `🐾 Pet Safe: ${plantInfo.petSafety?.isToxicToDogs || plantInfo.petSafety?.isToxicToCats ? 'Toxic' : 'Safe'}\n` +
      `📖 Details: ${plantInfo.generalInfo || ''}`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 md:pb-10 selection:bg-emerald-500/30 selection:text-emerald-200 no-scrollbar">
      <Head>
        <title>FloraAI — Botanical Specimen Intelligence & Medicinal Scanner</title>
        <meta
          name="description"
          content="Identify plant specimens, verify Ayurvedic medicinal values, screen pet toxicity, and detect artificial/toy plants with Gemini AI."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#059669" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>

      {/* Top Navbar */}
      <Navbar
        scanCount={history.length}
        onOpenHistory={() => setShowHistoryModal(true)}
        onOpenInstallApp={() => setShowInstallAppModal(true)}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 sm:py-8 space-y-6">
        {/* Hero Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.heroBadge}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.heroHeading}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            {t.heroDesc}
          </p>

          {/* Quick App Download Banner */}
          <div className="pt-1 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setShowInstallAppModal(true)}
              className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-300 hover:text-emerald-300 transition-all cursor-pointer shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{language === 'hi' ? '📲 FloraAI एंड्रॉइड ऐप उपलब्ध है (.apk डाउनलोड करें)' : '📲 FloraAI Android App available (Download APK)'}</span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* Instant Client Showcase Demo Presets */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.showcaseTitle}</span>
            </span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">
              {t.showcaseHint}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {getShowcaseSamples(language).map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleLoadShowcase(sample)}
                className="group px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-emerald-950/40 border border-slate-700/80 hover:border-emerald-500/50 text-xs font-medium text-slate-200 hover:text-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <span>{sample.label}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-700/60 group-hover:text-emerald-400 group-hover:border-emerald-500/40">
                  {sample.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Dropzone / Upload / Paste Card */}
        <DropzoneSection
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          imagePreview={imagePreview}
          loading={loading}
          language={language}
          onClearImage={() => {
            setImagePreview(null);
            setSelectedImage(null);
            setPlantInfo(null);
            setError(null);
          }}
          onIdentify={identifyPlant}
          onStartCamera={() => startCamera('environment')}
          onOpenFilePicker={openFilePicker}
          onPasteClick={handlePasteButtonClick}
        />

        {/* Analysis Progress with Live Elapsed Timer and YouTube-Style Skeleton Card */}
        {loading && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <AnalysisProgress onCancel={handleCancelScan} />
            <PlantSkeletonCard />
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-3 shadow-lg animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <span className="font-bold block text-rose-300">Scan Notice</span>
              <p className="leading-relaxed">{error}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-white h-7 px-2"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Botanical / Non-Plant / Artificial Plant Results */}
        {plantInfo && !loading && (
          <PlantResults
            plantInfo={plantInfo}
            isSpeaking={isSpeaking}
            copied={copied}
            onToggleSpeech={toggleSpeech}
            onCopySummary={copySummary}
            onOpenChat={() => setIsChatOpen(true)}
            language={language}
          />
        )}
      </main>

      {/* Live Viewfinder Modal */}
      {isCameraOpen && (
        <CameraModal
          videoRef={videoRef}
          cameraError={cameraError}
          onFlipCamera={flipCamera}
          onStopCamera={stopCamera}
          onCapture={captureSnapshot}
        />
      )}

      {/* Dynamic Live Translation Floating Notification */}
      {isTranslating && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900/95 border border-emerald-500/40 text-emerald-300 text-xs px-3.5 py-2 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Globe className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          <span>Translating specimen to {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.name || 'selected language'}...</span>
        </div>
      )}

      {/* Conversational Botanist Chat Drawer (Dr. Flora) */}
      <DoctorFloraDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        plantInfo={plantInfo}
        messages={chatMessages}
        input={chatInput}
        loading={chatLoading}
        isTranslating={isTranslating}
        language={language}
        onLanguageChange={handleLanguageChange}
        onInputChange={setChatInput}
        onSendMessage={sendChatMessage}
      />

      {/* Recent Scans History Modal */}
      <RecentScansModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={history}
        onSelectScan={handleSelectHistoryScan}
        onClearHistory={clearHistory}
        language={language}
      />

      {/* Install FloraAI App (APK & PWA) Modal */}
      <InstallAppModal
        isOpen={showInstallAppModal}
        onClose={() => setShowInstallAppModal(false)}
        language={language}
      />

      {/* Thumb-Friendly Mobile Bottom Navigation Bar */}
      <MobileBottomBar
        onCameraClick={() => startCamera('environment')}
        onUploadClick={openFilePicker}
        onPasteClick={handlePasteButtonClick}
        onHistoryClick={() => setShowHistoryModal(true)}
        onChatClick={() => setIsChatOpen(true)}
        historyCount={history.length}
        hasResult={Boolean(plantInfo)}
        language={language}
      />
    </div>
  );
}