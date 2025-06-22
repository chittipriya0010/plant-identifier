import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze this plant image and provide detailed information in the following JSON format:
    {
      "plantName": "Common and scientific name",
      "isDangerous": true/false,
      "dangerLevel": "Safe/Mildly Toxic/Moderately Toxic/Highly Toxic/Deadly",
      "toxicParts": ["list of toxic parts if any"],
      "symptoms": ["symptoms if ingested/touched"],
      "safetyTips": ["safety recommendations"],
      "generalInfo": "Brief description of the plant",
      "habitat": "Where this plant typically grows",
      "uses": "Common uses if any",
      "confidence": "percentage of identification confidence"
    }

    Focus particularly on safety information. If the plant is dangerous, provide detailed warnings. If you cannot identify the plant with reasonable confidence, indicate this clearly.`;

    // Remove the data URL prefix if present
    const base64Image = imageData.replace(/^data:image\/[a-z]+;base64,/, '');

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg'
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    let plantInfo;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        plantInfo = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the text
      plantInfo = {
        plantName: 'Unknown Plant',
        isDangerous: false,
        dangerLevel: 'Unknown',
        toxicParts: [],
        symptoms: [],
        safetyTips: ['Unable to determine safety - consult a botanist if needed'],
        generalInfo: text,
        habitat: 'Unknown',
        uses: 'Unknown',
        confidence: 'Low'
      };
    }

    res.status(200).json(plantInfo);
  } catch (error) {
    console.error('Error identifying plant:', error);
    res.status(500).json({ error: 'Failed to identify plant' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};