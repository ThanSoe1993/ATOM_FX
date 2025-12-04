import { GoogleGenAI } from "@google/genai";
import { ChecklistState, Trade } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzePsychology = async (
  context: string,
  recentLosses: number
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI Service Unavailable: Please check API Key.";

  try {
    const prompt = `
      I am a disciplined Forex trader using a rigid Supply and Demand strategy.
      My Strategy:
      1. Confirm Macro Trend.
      2. Wait for Retracement (COC).
      3. Structure Shift (Alignment COC).
      4. Supply/Demand Zone.
      5. Entry & Risk.
      
      My current state: "${context}".
      Recent Losses: ${recentLosses}.
      
      Act as a strict trading coach. If I am emotional, tell me to walk away. 
      Remind me to trust the Probability and the Plan. Do not give generic advice. Be harsh if needed to save my capital.
      Keep it under 80 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Stay disciplined. Stick to your plan.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI Coach. Remember: Discipline is key.";
  }
};

export const validateSetup = async (checklist: ChecklistState): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI Service Unavailable.";

  try {
    const prompt = `
      Review this Forex trade setup based on strict Supply and Demand rules:
      
      The Checklist Status:
      1. Macro Trend Confirmed: ${checklist.macroTrend}
      2. Retracement (Internal COC): ${checklist.retracementChoC}
      3. Structure Shift (Alignment COC): ${checklist.structureShift}
      4. S&D Zone Identified: ${checklist.supplyDemandZone}
      5. Risk Managed: ${checklist.entryRisk}
      
      Context: Pair ${checklist.pair}, Timeframe ${checklist.timeframe}.
      
      Task:
      If ANY of steps 1-4 are FALSE, output a WARNING explaining why I must not enter.
      If all are TRUE, confirm the setup is valid and remind me to set the Stop Loss at the structural point.
      Keep it concise (1-2 sentences).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Setup analysis complete.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not validate setup via AI.";
  }
};

export const generateJournalInsights = async (trades: Trade[]): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI Service Unavailable.";

  if (trades.length === 0) return "No trades to analyze yet.";

  // Simplify trade data to save tokens
  const tradeSummary = trades.map(t => 
    `${t.pair} ${t.direction} ${t.outcome} (R:R ${t.riskReward})`
  ).join('\n');

  try {
    const prompt = `
      Analyze these Forex trades based on Supply/Demand strategy consistency:
      ${tradeSummary}
      
      Identify 1 key pattern. Are they respecting R:R? Is the winrate sustainable?
      Give 1 actionable tip for next week.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Keep logging trades to get insights.";
  } catch (error) {
    return "Analysis failed.";
  }
};