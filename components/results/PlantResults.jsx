import React from 'react';
import { NonPlantCard } from './NonPlantCard';
import { ArtificialPlantCard } from './ArtificialPlantCard';
import { BotanicalPlantCard } from './BotanicalPlantCard';

export function PlantResults({
  plantInfo,
  isSpeaking,
  copied,
  onToggleSpeech,
  onCopySummary,
  onOpenChat,
  language = 'en',
}) {
  if (!plantInfo) return null;

  if (plantInfo.classification === 'not_a_plant') {
    return <NonPlantCard plantInfo={plantInfo} language={language} />;
  }

  if (plantInfo.classification === 'plastic_or_toy_plant' || plantInfo.isArtificial) {
    return <ArtificialPlantCard plantInfo={plantInfo} language={language} />;
  }

  return (
    <BotanicalPlantCard
      plantInfo={plantInfo}
      isSpeaking={isSpeaking}
      copied={copied}
      onToggleSpeech={onToggleSpeech}
      onCopySummary={onCopySummary}
      onOpenChat={onOpenChat}
      language={language}
    />
  );
}
