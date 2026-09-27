import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Ultra-fast lightweight models with separate available quotas
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plantContext, messages, language = 'en' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const languageInstruction = language === 'hi'
      ? 'Respond in clear, natural Hindi (हिन्दी).'
      : language === 'ur'
      ? 'Respond in fluent, polite Urdu (اردو).'
      : language === 'th'
      ? 'Respond in natural, polite Thai (ภาษาไทย).'
      : language === 'ms'
      ? 'Respond in natural Bahasa Melayu (Malaysian).'
      : language === 'tl'
      ? 'Respond in natural Tagalog / Filipino.'
      : language === 'ko'
      ? 'Respond in polite, natural Korean (한국어).'
      : language === 'ja'
      ? 'Respond in natural Japanese (日本語).'
      : language === 'es'
      ? 'Respond in fluent Spanish (Español).'
      : language === 'fr'
      ? 'Respond in fluent French (Français).'
      : language === 'de'
      ? 'Respond in fluent German (Deutsch).'
      : language === 'ar'
      ? 'Respond in natural Arabic (العربية).'
      : language === 'ru'
      ? 'Respond in natural Russian (Русский).'
      : 'Respond in clear, friendly English.';

    const systemInstruction = `You are "Dr. Flora", a friendly, knowledgeable Master Botanist, Ayurvedic Herbalist, and Plant Doctor.
The user is asking questions about a plant scanned on their device.

CURRENT SPECIMEN CONTEXT:
- Name: ${plantContext?.plantName || 'Unknown plant'}
- Scientific Name: ${plantContext?.scientificName || 'N/A'}
- Hindi / Local Name: ${plantContext?.hindiName || 'N/A'}
- Classification: ${plantContext?.classification || 'real_plant'}
- Is Artificial: ${plantContext?.isArtificial ? 'Yes (Plastic/Toy decor)' : 'No (Authentic live plant)'}
- Danger / Toxicity Level: ${plantContext?.dangerLevel || 'Safe'}
- Medicinal Status: ${plantContext?.isMedicinal ? 'Medicinal' : 'Non-medicinal'}
- Pet Safety: Dogs: ${plantContext?.petSafety?.isToxicToDogs ? 'Toxic' : 'Safe'}, Cats: ${plantContext?.petSafety?.isToxicToCats ? 'Toxic' : 'Safe'}

LANGUAGE RULE:
${languageInstruction}

GUIDELINES:
1. Provide accurate, practical advice in short paragraphs or bullet points.
2. If it is an artificial/toy plant, remind them kindly that it has no biological care or medicinal benefits.
3. If they ask about medicinal preparation or home remedies, provide traditional insights with a medical disclaimer: "Consult a certified doctor or herbal practitioner before consuming remedies."
4. If they ask about pet poisoning, advise immediate veterinary care.
5. Keep responses concise, warm, and easy to read on mobile screens.`;

    // Filter and sanitize chat turns
    const validTurns = [];
    let lastRole = null;

    for (const msg of messages) {
      const role = msg.role === 'user' ? 'user' : 'model';
      const text = typeof msg.content === 'string' ? msg.content.trim() : '';
      if (!text) continue;

      // Ensure turn alternation
      if (role !== lastRole) {
        validTurns.push({
          role,
          parts: [{ text }],
        });
        lastRole = role;
      } else {
        // If consecutive roles exist, append text
        validTurns[validTurns.length - 1].parts[0].text += `\n${text}`;
      }
    }

    // Ensure the conversation starts with a user turn for Gemini
    if (validTurns.length === 0 || validTurns[0].role !== 'user') {
      validTurns.unshift({
        role: 'user',
        parts: [{ text: `Hello Dr. Flora, I would like to ask about ${plantContext?.plantName || 'this plant'}.` }],
      });
    }

    let reply = null;
    let lastError = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction,
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 600,
          },
        });

        const result = await withTimeout(
          model.generateContent({ contents: validTurns }),
          12000 // 12 seconds per candidate
        );
        const response = await result.response;
        reply = response.text();
        if (reply) break;
      } catch (err) {
        console.warn(`Chat model ${modelName} error (${err.message}). Trying next candidate...`);
        lastError = err;
      }
    }

    if (!reply) {
      throw lastError || new Error('Dr. Flora is currently busy. Please ask again.');
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat botanist error:', error.message);
    return res.status(500).json({
      error: 'Dr. Flora is taking a short rest. Please ask your question again.',
    });
  }
}
