
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key not found. Make sure process.env.API_KEY is set.");
  // In a real app, you might throw an error or disable AI features.
  // For this exercise, we'll allow the app to run but Gemini calls will fail.
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); // Provide a fallback to prevent crash if API_KEY is undefined

export const geminiService = {
  generateTaskDescription: async (taskTitle: string): Promise<string> => {
    if (!API_KEY) {
        return "API Key is not configured. Cannot generate description.";
    }
    if (!taskTitle.trim()) {
      return "Please provide a task title to generate a description.";
    }

    try {
      const prompt = `Generate a concise and actionable task description for a task titled: "${taskTitle}". The description should be suitable for a task management app. Keep it brief, ideally 1-2 sentences. If the title is vague, try to make a reasonable suggestion.`;
      
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: prompt,
        // Using default thinkingConfig (enabled) for higher quality.
      });

      const text = response.text;
      if (text) {
        return text.trim();
      } else {
        return "No description generated. Try a more specific title or write one manually.";
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      // Check for specific error types if needed, e.g., API key issues, quota limits
      if (error instanceof Error && error.message.includes("API key not valid")) {
        return "Error: The Gemini API key is invalid. Please check your configuration.";
      }
      return "Failed to generate description due to an API error. Please try again later or write one manually.";
    }
  },
};