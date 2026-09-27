import { identifyPlantImage } from '@/lib/gemini';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, language = 'en' } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
    }

    let base64Image = imageData;
    let mimeType = 'image/jpeg';

    const match = imageData.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (match) {
      mimeType = match[1];
      base64Image = match[2];
    } else {
      base64Image = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    }

    // Call fast Gemini router with timeout protection and language support
    const plantInfo = await identifyPlantImage(base64Image, mimeType, language);

    return res.status(200).json(plantInfo);
  } catch (error) {
    console.error('API identify-plant error:', error.message);
    const isTimeout = error.message.includes('Timeout');
    return res.status(isTimeout ? 408 : 500).json({
      error: isTimeout
        ? 'Scanning took too long due to high network demand. Please retry with a smaller photo.'
        : 'Failed to analyze plant. Please try again.',
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '12mb',
    },
  },
};