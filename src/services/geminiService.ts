import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  async generateCaptions(audioUrl: string): Promise<string[]> {
    // In a real app, we'd send the audio file. For this demo, we'll simulate it.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 5 cinematic captions for a high-energy travel reel.",
    });
    return response.text?.split('\n').filter(l => l.trim()) || [];
  },

  async suggestColorGrading(frameBase64: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: frameBase64,
          },
        },
        {
          text: "Analyze this video frame and suggest professional color grading parameters (brightness, contrast, saturation, temperature) in JSON format.",
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brightness: { type: Type.NUMBER },
            contrast: { type: Type.NUMBER },
            saturation: { type: Type.NUMBER },
            temperature: { type: Type.NUMBER },
          },
          required: ["brightness", "contrast", "saturation", "temperature"],
        },
      },
    });
    return JSON.parse(response.text || "{}");
  }
};
