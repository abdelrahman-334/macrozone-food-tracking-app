import {Meal} from '../storage/meals';

export async function analyzeMealImage(base64Image: string): Promise<Meal> {

  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');
  const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY!;
    const MODEL = 'gemini-3.5-flash'; 
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: cleanBase64,
                },
              },
              {
                text: `Analyze this meal image and estimate the nutritional content. 
                Return a JSON object with the following fields: 
                "name" (string), "calories" (integer), "protein" (integer), "carbs" (integer), "fat" (integer).`,
              },
            ],
          },
        ],
      }),
    }
      
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message ?? 'Failed to analyze image');
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Error analyzing image: No text response');
  }
  try {
     const cleanedText = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleanedText) as Meal;
    return {
      name: result.name || 'Unknown Meal',
      calories: Math.round(Number(result.calories)) || 0,
      protein: Math.round(Number(result.protein)) || 0,
      carbs: Math.round(Number(result.carbs)) || 0,
      fat: Math.round(Number(result.fat)) || 0,
    } as Meal;
  } catch {
    throw new Error('Could not parse nutrition data from response');
  }
}