import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API key is missing. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateFortune(): Promise<{ prediction: string; imageUrl: string }> {
  try {
    // 1. Сгенерировать текст предсказания
    const predictionPrompt = `Сгенерируй короткое (2-3 предложения), позитивное и мудрое предсказание на день в мистическом стиле. Предсказание должно быть уникальным. Ответь только текстом предсказания, без лишних фраз, приветствий или заголовков.`;

    const predictionResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: predictionPrompt
    });

    const predictionText = predictionResponse.text.trim();
    if (!predictionText) {
        throw new Error("Предсказание оказалось пустым.");
    }

    // 2. Сгенерировать тематическое изображение на основе предсказания
    const imagePrompt = `Создай изображение, иллюстрирующее это предсказание: "${predictionText}". Стиль: фэнтези, мистика, кинематографическое освещение, высокая детализация, цифровая живопись.`;
    
    const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: imagePrompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    let imageUrl = '';
    const part = imageResponse.candidates?.[0]?.content?.parts?.[0];

    if (part?.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
    }

    if (!imageUrl) {
        console.error("Image generation failed, response part was:", part);
        throw new Error("Не удалось создать тематическое изображение.");
    }

    return { prediction: predictionText, imageUrl };

  } catch (error) {
    console.error("Error generating fortune:", error);
    throw new Error("Не удалось получить предсказание от звёзд. Попробуйте снова.");
  }
}