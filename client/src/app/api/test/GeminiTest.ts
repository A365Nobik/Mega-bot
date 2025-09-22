import { GoogleGenAI } from "@google/genai";
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });
const geminiTest = async (userReq: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userReq,
  });
  return response.text;
};
export { geminiTest };
