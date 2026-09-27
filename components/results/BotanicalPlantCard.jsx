import React, { useState } from 'react';
import {
  Leaf,
  Volume2,
  Share2,
  Check,
  MessageSquare,
  HeartPulse,
  ShieldAlert,
  ShieldCheck,
  Dog,
  Cat,
  CheckCircle,
  Info,
  Sun,
  Droplets,
  Sprout,
  Compass,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { UI_TRANSLATIONS } from '@/lib/languages';

export function BotanicalPlantCard({
  plantInfo,
  isSpeaking,
  copied,
  onToggleSpeech,
  onCopySummary,
  onOpenChat,
  language = 'en',
}) {
  const [activeTab, setActiveTab] = useState('medicinal');
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <Card className="border-slate-800 bg-slate-900/80 animate-in fade-in duration-300">
      {/* Hero Header */}
      <CardHeader className="space-y-3 pb-4 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="gap-1">
              <Leaf className="w-3 h-3 text-emerald-400" />
              <span>{t.botanicalSpecimen || 'Botanical Specimen'}</span>
            </Badge>
            {plantInfo.hindiName && (
              <Badge variant="secondary" className="text-amber-300 bg-amber-500/10 border-amber-500/30">
                {plantInfo.hindiName}
              </Badge>
            )}
            <span className="text-xs text-slate-400 font-mono">
              {plantInfo.confidence || '94%'} {t.confidence || 'confidence'}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={onToggleSpeech}
              className="h-8 gap-1.5 text-xs text-slate-300"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-red-400 animate-pulse' : ''}`} />
              <span className="hidden sm:inline">{isSpeaking ? (t.stop || 'Stop') : (t.listen || 'Listen')}</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onCopySummary}
              className="h-8 gap-1.5 text-xs text-slate-300"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? (t.copied || 'Copied') : (t.share || 'Share')}</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onOpenChat}
              className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t.askDrFlora || 'Ask Dr. Flora'}</span>
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {plantInfo.plantName}
          </h2>
          {plantInfo.scientificName && (
            <p className="text-xs sm:text-sm italic font-mono text-emerald-400 mt-0.5">
              {plantInfo.scientificName} {plantInfo.family ? `• Family: ${plantInfo.family}` : ''}
            </p>
          )}
        </div>

        {/* Quick Metric Badges */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Medicinal */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-semibold mb-0.5">
              <HeartPulse className="w-3 h-3 text-emerald-400" />
              <span>{t.medicinal || 'Medicinal'}</span>
            </div>
            <span className="text-xs font-bold text-white truncate block">
              {plantInfo.isMedicinal ? (plantInfo.medicinalCategory || t.medicinal || 'Active Herb') : (t.nonMedicinal || 'Non-Medicinal')}
            </span>
          </div>

          {/* Toxicity */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-semibold mb-0.5">
              {plantInfo.isDangerous ? (
                <ShieldAlert className="w-3 h-3 text-amber-400" />
              ) : (
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
              )}
              <span>{t.safety || 'Safety'}</span>
            </div>
            <span className={`text-xs font-bold truncate block ${plantInfo.isDangerous ? 'text-amber-400' : 'text-emerald-400'}`}>
              {plantInfo.dangerLevel || (plantInfo.isDangerous ? (t.toxic || 'Toxic') : (t.safe || 'Safe'))}
            </span>
          </div>

          {/* Pet Safety */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-semibold mb-0.5">
              <Dog className="w-3 h-3 text-slate-400" />
              <span>{t.pets || 'Pets'}</span>
            </div>
            <span className={`text-xs font-bold truncate block ${
              plantInfo.petSafety?.isToxicToDogs || plantInfo.petSafety?.isToxicToCats ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {plantInfo.petSafety?.isToxicToDogs || plantInfo.petSafety?.isToxicToCats ? (t.toxic || 'Toxic') : (t.petSafe || 'Pet Safe')}
            </span>
          </div>
        </div>
      </CardHeader>

      {/* Tabs Section */}
      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="medicinal">
              <HeartPulse className="w-3.5 h-3.5 mr-1" />
              <span>{t.medicinalTab || 'Medicinal'}</span>
            </TabsTrigger>
            <TabsTrigger value="safety">
              <ShieldAlert className="w-3.5 h-3.5 mr-1" />
              <span>{t.toxicityTab || 'Safety & Pets'}</span>
            </TabsTrigger>
            <TabsTrigger value="care">
              <Sprout className="w-3.5 h-3.5 mr-1" />
              <span>{t.careTab || 'Care Guide'}</span>
            </TabsTrigger>
          </TabsList>          {/* TAB 1: MEDICINAL */}
          <TabsContent value="medicinal" className="space-y-3 pt-2">
            {plantInfo.isMedicinal ? (
              <>
                {plantInfo.medicinalBenefits && plantInfo.medicinalBenefits.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      {t.primaryHealthBenefits || 'Primary Health Benefits:'}
                    </span>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {plantInfo.medicinalBenefits.map((b, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 flex items-start gap-2"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {plantInfo.traditionalAyurvedicUses && (
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-xs font-semibold text-amber-300 block">
                      {t.traditionalUses || 'Traditional & Ayurvedic Uses:'}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {plantInfo.traditionalAyurvedicUses}
                    </p>
                  </div>
                )}

                {/* Precaution */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>{t.precaution || 'Precaution:'}</strong> {plantInfo.medicinalPrecautions ||
                      t.defaultPrecaution || 'Do not ingest wild plants or self-medicate without consulting a certified doctor or Ayurvedic practitioner.'}
                  </p>
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                {t.nonMedicinalDesc || 'This species is not classified as a standard medicinal or Ayurvedic herb.'}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: SAFETY & PETS */}
          <TabsContent value="safety" className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
              <ShieldAlert className={`w-5 h-5 shrink-0 ${plantInfo.isDangerous ? 'text-amber-400' : 'text-emerald-400'}`} />
              <div className="space-y-1 text-xs">
                <h4 className="font-semibold text-white">
                  {t.toxicityStatus || 'Toxicity Status:'} {plantInfo.dangerLevel || (plantInfo.isDangerous ? (t.toxic || 'Toxic') : (t.safe || 'Safe'))}
                </h4>
                <p className="text-slate-400">
                  {plantInfo.isDangerous
                    ? (plantInfo.toxicityDescription || (plantInfo.safetyTips && plantInfo.safetyTips[0]) || (t.toxicDescription || 'Contains compounds that can trigger dermatitis or gastrointestinal distress if touched or ingested.'))
                    : (t.safeDescription || 'Non-toxic for standard casual touch.')}
                </p>
              </div>
            </div>

            {/* Pet Safety Breakdown */}
            {plantInfo.petSafety && (
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">
                  {t.petRiskAssessment || 'Pet Risk Assessment:'}
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <Dog className="w-4 h-4 text-slate-400" />
                    <span>{t.dogs || 'Dogs'}: </span>
                    <strong className={plantInfo.petSafety.isToxicToDogs ? 'text-red-400' : 'text-emerald-400'}>
                      {plantInfo.petSafety.isToxicToDogs ? (t.toxic || 'Toxic') : (t.safe || 'Safe')}
                    </strong>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <Cat className="w-4 h-4 text-slate-400" />
                    <span>{t.cats || 'Cats'}: </span>
                    <strong className={plantInfo.petSafety.isToxicToCats ? 'text-red-400' : 'text-emerald-400'}>
                      {plantInfo.petSafety.isToxicToCats ? (t.toxic || 'Toxic') : (t.safe || 'Safe')}
                    </strong>
                  </div>
                </div>
                {plantInfo.petSafety.petSymptoms && (
                  <p className="text-[11px] text-slate-400">
                    <strong>{t.symptomsInAnimals || 'Symptoms in Animals:'}</strong> {plantInfo.petSafety.petSymptoms}
                  </p>
                )}
              </div>
            )}

            {/* Toxic Parts & Symptoms */}
            {plantInfo.isDangerous && plantInfo.symptoms && plantInfo.symptoms.length > 0 && (
              <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 text-xs text-red-200">
                <strong>{t.reactionSymptoms || 'Reaction Symptoms:'}</strong> {plantInfo.symptoms.join(', ')}
              </div>
            )}
          </TabsContent>

          {/* TAB 3: CARE & CLIMATE */}
          <TabsContent value="care" className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {plantInfo.generalInfo}
            </div>

            {plantInfo.careGuide && (
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <Sun className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                  <span className="text-[10px] text-slate-400 block">{t.light || 'Light'}</span>
                  <span className="text-xs font-semibold text-white">{plantInfo.careGuide.sunlight || 'Medium'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <Droplets className="w-4 h-4 mx-auto text-blue-400 mb-1" />
                  <span className="text-[10px] text-slate-400 block">{t.water || 'Water'}</span>
                  <span className="text-xs font-semibold text-white">{plantInfo.careGuide.watering || 'Moderate'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <Sprout className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
                  <span className="text-[10px] text-slate-400 block">{t.difficulty || 'Difficulty'}</span>
                  <span className="text-xs font-semibold text-white">{plantInfo.careGuide.difficulty || 'Easy'}</span>
                </div>
              </div>
            )}

            {plantInfo.habitat && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>{t.naturalHabitat || 'Natural Habitat:'}</strong> {plantInfo.habitat}</span>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
