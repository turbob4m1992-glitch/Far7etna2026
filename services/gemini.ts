import { GoogleGenAI, Type } from "@google/genai";
import { InvitationData } from "../types";

const getAI = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is missing");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateLoveStory = async (
  partner1: string,
  partner2: string,
  points: string
): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `
      Write a short, engaging, and slightly futuristic or magical love story summary (max 150 words) for a wedding invitation.
      Couple: ${partner1} and ${partner2}.
      Key Story Points: ${points}.
      Tone: Romantic, Epic, Whimsical.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Our story is written in the stars...";
  } catch (error) {
    console.error("Error generating story:", error);
    return "Once upon a time, two souls met and the universe changed forever. (AI unavailable)";
  }
};

export const getConciergeResponse = async (
  history: { role: string; text: string }[],
  currentQuestion: string,
  data: InvitationData
): Promise<string> => {
  try {
    const ai = getAI();
    
    // Construct system context
    const context = `
      You are "AURA", the AI Wedding Concierge for ${data.partner1} and ${data.partner2}.
      Wedding Date: ${data.date}.
      Venue: ${data.venueName}, ${data.location}.
      Schedule: ${data.schedule.map(s => `${s.time}: ${s.event}`).join(', ')}.
      
      Your goal is to answer guest questions politely, briefly, and helpfully based on this data.
      If you don't know the answer (e.g., parking details not listed), say you'll ask the couple.
      Keep it futuristic and classy.
    `;

    // Transform simple history to Content format if needed, but for simple QA 
    // we can just append previous turns or rely on a fresh prompt with context for simplicity in this demo.
    // For better results in a real app, we'd use the Chat API. Here we'll use generateContent with context.
    
    const prompt = `
      ${context}
      
      Guest Question: ${currentQuestion}
      
      Answer (keep it under 50 words):
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "I am currently recalibrating my sensors. Please ask again later.";
  } catch (error) {
    console.error("Error chatting:", error);
    return "Connection to the mothership interrupted. Please try again.";
  }
};