import { GoogleGenAI } from "@google/genai";
import { AiAction } from "../types";

const getSystemInstruction = (): string => {
  return `You are a social media expert assistant. Your goal is to help the user format and write better posts for Facebook, Instagram, LinkedIn, and Twitter.
  
  CRITICAL RULES:
  1. Always return response in standard Markdown format (using ** for bold, * for italic, etc).
  2. Do NOT use Unicode math font characters yourself. The application handles that downstream.
  3. Return ONLY the body text. No conversational filler ("Here is your post", "Sure").
  4. Preserve existing newlines.`;
};

const getPromptForAction = (action: AiAction, text: string): string => {
  switch (action) {
    case AiAction.Socialify:
      return `Rewrite the following text to be more engaging, friendly, and viral. 
      - Add relevant emojis. 
      - Use Markdown bold (**) for key phrases to make them pop. 
      - Break up long paragraphs.
      - Keep the core meaning.
      
      Text:
      ${text}`;
    
    case AiAction.Hashtags:
      return `Analyze the following text and append 5-7 relevant, high-traffic, trending hashtags to the end of it. 
      Do NOT change the original text, just append the hashtags at the bottom.
      
      Text:
      ${text}`;
      
    case AiAction.Shorten:
      return `Rewrite the following text to be concise and punchy. 
      - Remove fluff.
      - Keep the core message.
      - Keep any code snippets or lists if they are essential.
      
      Text:
      ${text}`;
    
    case AiAction.Expand:
      return `Expand on the following text to make it more informative and descriptive. 
      - Add a professional yet engaging tone.
      - Elaborate on key points.
      
      Text:
      ${text}`;
      
    default:
      return text;
  }
};

export const generateSocialContent = async (action: AiAction, currentText: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const prompt = getPromptForAction(action, currentText);
    const systemInstruction = getSystemInstruction();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });

    // Extract text safely
    const resultText = response.text;
    return resultText || currentText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
