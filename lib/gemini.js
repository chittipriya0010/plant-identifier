import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Primary model: gemini-3.1-flash-lite (ultra-fast, 1.9s, fresh daily quota)
// Fallback model: gemini-3.5-flash-lite
const PRIMARY_MODEL = 'gemini-3.1-flash-lite';
const FALLBACK_MODEL = 'gemini-3.5-flash-lite';

// Timeout promise wrapper
const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
};

export const identifyPlantImage = async (base64Image, mimeType = 'image/jpeg', language = 'en') => {
  const langMap = {
    hi: 'Hindi (हिन्दी)',
    ur: 'Urdu (اردو)',
    th: 'Thai (ภาษาไทย)',
    ms: 'Malay (Bahasa Melayu)',
    tl: 'Tagalog / Filipino',
    ko: 'Korean (한국어)',
    ja: 'Japanese (日本語)',
    es: 'Spanish (Español)',
    fr: 'French (Français)',
    de: 'German (Deutsch)',
    ar: 'Arabic (العربية)',
    ru: 'Russian (Русский)',
    en: 'English',
  };
  const targetLanguage = langMap[language] || 'English';

  // Tight, concise prompt: fewer tokens generated = much faster response (<10s)
  const prompt = `Analyze this image and identify if it is a plant, plastic plant, or non-plant.
Respond in ${targetLanguage} for all descriptive texts, benefits, warnings, and care instructions (keep scientificName in Latin).
Respond ONLY with this exact JSON format:
{
  "classification": "real_plant" | "plastic_or_toy_plant" | "not_a_plant",
  "detectedObject": "Object name if not_a_plant",
  "nonPlantInstructions": "Helpful guidance explaining this is not a plant in ${targetLanguage}",

  "isArtificial": true/false,
  "artificialType": "Plastic plant" | "Toy plant" | "None",
  "syntheticCues": ["Visual clues why it is fake in ${targetLanguage}"],
  "artificialNote": "Note explaining decorative nature in ${targetLanguage}",

  "plantName": "Common Name in ${targetLanguage}",
  "scientificName": "Botanical Name in Latin",
  "hindiName": "Popular local/vernacular name in ${targetLanguage}",
  "family": "Plant family",
  "confidence": "High (90-95%)" | "Medium" | "Low",

  "isMedicinal": true/false,
  "medicinalCategory": "High Medicinal Value" | "Moderate" | "Traditional" | "None",
  "medicinalBenefits": ["Short benefits points"],
  "usedParts": ["Leaves", "Roots", "Bark", "Flowers", "Seeds", "None"],
  "traditionalAyurvedicUses": "Brief Ayurvedic uses",
  "medicinalPrecautions": "Medical warning: Consult doctor before using herbs",

  "isDangerous": true/false,
  "dangerLevel": "Safe" | "Mildly Toxic" | "Moderately Toxic" | "Highly Toxic",
  "toxicParts": ["Toxic parts if any"],
  "symptoms": ["Key symptoms if touched or eaten"],
  "safetyTips": ["Handling tips"],

  "petSafety": {
    "isToxicToDogs": true/false,
    "isToxicToCats": true/false,
    "petRiskLevel": "Pet Safe" | "Toxic",
    "petSymptoms": "Symptoms in pets"
  },

  "generalInfo": "Brief description of the plant",
  "habitat": "Native region",
  "careGuide": {
    "sunlight": "Direct / Indirect / Shade",
    "watering": "Low / Moderate / High",
    "difficulty": "Easy / Moderate"
  },
  "disclaimer": "AI identification is educational. Consult health professionals for medical uses."
}`;

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType,
    },
  };

  const executeModel = async (modelName, timeoutMs = 18000) => {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
        maxOutputTokens: 900,
      },
    });

    const result = await withTimeout(
      model.generateContent([prompt, imagePart]),
      timeoutMs
    );
    const response = await result.response;
    const text = response.text();

    try {
      return JSON.parse(text);
    } catch (e) {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw e;
    }
  };


  // Try primary model with generous 35s budget so scans never fail prematurely
  try {
    return await executeModel(PRIMARY_MODEL, 35000);
  } catch (err) {
    console.warn(`[Gemini Router] Primary ${PRIMARY_MODEL} failed (${err.message}). Trying fallback ${FALLBACK_MODEL}...`);
    // Fallback model with 20s budget
    try {
      return await executeModel(FALLBACK_MODEL, 20000);
    } catch (fallbackErr) {
      console.error(`[Gemini Router] Both models failed:`, fallbackErr.message);
      throw fallbackErr;
    }
  }
};
