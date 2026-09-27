import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
];

const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
};

const LANGUAGE_MAP = {
  hi: 'Hindi (हिन्दी)',
  ur: 'Urdu (اردو)',
  th: 'Thai (ภาษาไทย)',
  ms: 'Malay / Bahasa Melayu (Malaysia)',
  tl: 'Tagalog / Filipino (Philippines)',
  ko: 'Korean (한국어)',
  ja: 'Japanese (日本語)',
  es: 'Spanish (Español)',
  fr: 'French (Français)',
  de: 'German (Deutsch)',
  ar: 'Arabic (العربية)',
  ru: 'Russian (Русский)',
  en: 'English',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { targetLanguage = 'en', plantInfo, chatMessages } = req.body;

    if (!plantInfo && (!chatMessages || chatMessages.length === 0)) {
      return res.status(400).json({ error: 'Nothing to translate' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const targetLangName = LANGUAGE_MAP[targetLanguage] || 'English';

    // Prepare prompt
    const prompt = `You are a professional botanical and multilingual medical herbal translator.
Translate the provided botanical specimen details and any chat conversations into ${targetLangName}.

TRANSLATION RULES:
1. Keep the exact same JSON key names and data structure.
2. Keep scientific Latin names (e.g. "Ocimum tenuiflorum", "Aloe barbadensis miller") intact in Latin.
3. Translate common plant names, categories, medicinal benefits, traditional uses, precautions, symptoms, safety tips, pet risks, care guide, artificial cues, and chat messages into natural, accurate, fluent ${targetLangName}.
4. Retain all booleans (true/false) unchanged.
5. In chat messages, keep the warm, professional persona of Dr. Flora, Master Botanist.

Return ONLY this valid JSON schema:
{
  "translatedPlantInfo": {
    "plantName": "Translated common plant name",
    "scientificName": "Latin Botanical Name (keep original)",
    "hindiName": "Local / Vernacular name in target language or popular name",
    "family": "Translated family",
    "confidence": "High / Medium / Low",
    "classification": "keep original",
    "isMedicinal": true/false,
    "medicinalCategory": "Translated category",
    "medicinalBenefits": ["Translated bullet points"],
    "usedParts": ["Translated parts"],
    "traditionalAyurvedicUses": "Translated traditional text",
    "medicinalPrecautions": "Translated medical warning",
    "isDangerous": true/false,
    "dangerLevel": "Translated safety status",
    "toxicParts": ["Translated toxic parts"],
    "symptoms": ["Translated symptoms"],
    "safetyTips": ["Translated safety tips"],
    "petSafety": {
      "isToxicToDogs": true/false,
      "isToxicToCats": true/false,
      "petRiskLevel": "Translated risk level",
      "petSymptoms": "Translated pet symptoms"
    },
    "generalInfo": "Translated description",
    "habitat": "Translated habitat",
    "careGuide": {
      "sunlight": "Translated sunlight",
      "watering": "Translated watering",
      "difficulty": "Translated difficulty"
    },
    "disclaimer": "Translated disclaimer",
    "isArtificial": true/false,
    "artificialType": "Translated type if artificial",
    "syntheticCues": ["Translated visual clues if artificial"],
    "artificialNote": "Translated note if artificial",
    "detectedObject": "Translated detected object if not a plant",
    "nonPlantInstructions": "Translated guidance if not a plant"
  },
  "translatedChatMessages": [
    {
      "role": "user" or "model",
      "content": "Translated message in ${targetLangName}"
    }
  ]
}

DATA TO TRANSLATE:
${JSON.stringify({
  plantInfo: plantInfo || null,
  chatMessages: Array.isArray(chatMessages) ? chatMessages : [],
})}`;

    let lastError = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
            maxOutputTokens: 2048,
          },
        });

        const result = await withTimeout(
          model.generateContent(prompt),
          14000
        );
        const response = await result.response;
        const text = response.text();

        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch (e) {
          const match = text.match(/\{[\s\S]*\}/);
          if (match) parsed = JSON.parse(match[0]);
          else throw e;
        }

        // Return translated bundle with fallbacks
        return res.status(200).json({
          translatedPlantInfo: parsed.translatedPlantInfo || plantInfo,
          translatedChatMessages: parsed.translatedChatMessages || chatMessages,
        });
      } catch (err) {
        lastError = err;
        console.warn(`[Translate Router] Model ${modelName} failed (${err.message}). Trying next candidate...`);
      }
    }

    // Fallback: return original without breaking user UI
    console.error('All translation models failed:', lastError?.message);
    return res.status(200).json({
      translatedPlantInfo: plantInfo,
      translatedChatMessages: chatMessages,
      fallback: true,
    });
  } catch (error) {
    console.error('API translate-results error:', error);
    return res.status(500).json({ error: error.message || 'Translation failed' });
  }
}
