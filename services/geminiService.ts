import { GoogleGenerativeAI } from "@google/generative-ai";
import { Agent, Evaluation } from "../types";

// Replace with your actual API Key or use an environment variable
const API_KEY = "YOUR_GEMINI_API_KEY_HERE";
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateCoachingFeedback = async (agent: Agent, latestEval: Evaluation | undefined) => {
  if (!latestEval) return "Please select a date range with evaluation data to generate AI coaching.";

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are an expert Call Center Performance Coach. 
    Analyze the following performance data for agent ${agent.name}:
    
    - Quality Score: ${latestEval.score}%
    - Product Knowledge: ${latestEval.kpis?.product}/100
    - Phone Etiquette: ${latestEval.kpis?.etiquette}/100
    - Problem Solving: ${latestEval.kpis?.solving}/100
    - Capturing Info: ${latestEval.kpis?.capture}/100
    
    Evaluator's Positive Feedback: "${latestEval.positivePoints}"
    Areas for Improvement: "${latestEval.improvementAreas}"

    Write a brief, motivating, and professional 3-sentence coaching tip for the agent's dashboard. 
    Focus on one specific strength to maintain and one specific action to improve their score. 
    Keep the tone supportive and concise.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI Coach is taking a quick break. Please try again in a moment!";
  }
};