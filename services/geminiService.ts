import { GoogleGenAI } from "@google/genai";
import { Agent } from '../types';

// --- MOCK DATA FOR DEMO MODE ---
const MOCK_TEAM_ANALYSIS = `
### 📊 Executive Summary: Team Performance Report

**1. Overall Team Health**
*   **Volume:** Strong call volume (380+ calls) indicating high demand today.
*   **CSAT:** Team average is **4.6/5**, well above the 4.2 KPI benchmark.
*   **Resolution:** Resolution rates are healthy at **89%** average, though resolution time varies.

**2. Quality Assurance Insights**
*   **Strengths:** "Phone Etiquette" and "Capturing Information" are consistently high (90%+).
*   **Areas for Improvement:** "Promotion/Upselling" is the weakest metric, with the team average sitting at 68%.

**3. Top Performers** 🏆
*   **Jessica Dubrow:** Highest CSAT (4.9) and Resolution Rate (95%).
*   **Sarah Jenkins:** Excellent balance of speed (AHT) and Quality Scores.

**4. Coaching Opportunities** 🎯
*   **David Miller:** Needs support with *Capturing Information* (80%) to reduce callback rates.
*   **William Brown:** Low *Upselling* score (50%) despite high operational efficiency.

**5. Strategic Recommendation** 🚀
*   **Action:** Implement a 15-minute "Upselling Best Practices" huddle tomorrow morning. Focus on transition phrases for the new Spicy Burger promo.
`;

const getMockTips = (name: string) => `
**Coaching Tips for ${name}:**

1.  **Boost Upselling:** Your promotion score is currently your lowest metric. Try offering the "Meal Deal Upgrade" immediately after confirming the main entree.
2.  **Active Listening:** Great job on phone etiquette! To improve *Problem Solving*, try repeating the customer's issue back to them to ensure alignment before searching for a fix.
3.  **Knowledge Base:** Your AHT is solid. To shave off another 10 seconds, remember to use the Quick-Search shortcuts (Ctrl+K) in the portal.
`;

// --- REAL SERVICE LOGIC ---

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return null; // Return null if no key, we will handle this in the functions
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeTeamPerformance = async (agents: Agent[]): Promise<string> => {
  try {
    const ai = getClient();
    
    // FALLBACK: If no API Key, return Mock Data
    if (!ai) {
      console.log("⚠️ No API Key found. Returning Mock Team Analysis.");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay for realism
      return MOCK_TEAM_ANALYSIS;
    }

    const dataString = JSON.stringify(agents.map(a => ({
      name: a.name,
      metrics: a.metrics,
      quality: a.qualityMetrics,
      status: a.status
    })));

    const prompt = `
      You are a senior Operations Manager for "Dial n Dine", a fast food call center.
      Analyze the following JSON performance data for our helpdesk agents:
      
      ${dataString}

      Please provide a concise Executive Summary Report in Markdown format with the following sections:
      1. **Overall Team Health**: Summary of volume, CSAT, and Resolution Rates.
      2. **Quality Assurance Insights**: specifically analyze "Promotion/Upselling" and "Phone Etiquette" scores across the team. Who is struggling?
      3. **Top Performers**: Identify the top 2 agents based on a balance of Operational Efficiency (AHT, Solved Tickets) and Quality Scores.
      4. **Coaching Opportunities**: Identify 2 agents who need help and specific advice (e.g., low Upselling score).
      5. **Strategic Recommendation**: One high-level action item for next week.
      
      Keep the tone professional yet encouraging. Use bullet points and bold text for readability.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate insights at this time.";
  } catch (error: any) {
    console.error("Error analyzing performance:", error);
    // If API call fails, fallback to mock data so the app doesn't break
    return MOCK_TEAM_ANALYSIS;
  }
};

export const getAgentCoachingTips = async (agent: Agent): Promise<string> => {
  try {
    const ai = getClient();

    // FALLBACK: If no API Key, return Mock Data
    if (!ai) {
      console.log("⚠️ No API Key found. Returning Mock Coaching Tips.");
      await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
      return getMockTips(agent.name);
    }

    const prompt = `
      You are a supportive Performance Coach. Provide 3 short, actionable tips for agent ${agent.name} based on their stats:
      
      Operational:
      - Calls: ${agent.metrics.callsTaken}
      - AHT: ${agent.metrics.avgHandleTime}s
      - Resolution Rate: ${agent.metrics.resolutionRate}%
      
      Quality Scores (0-100):
      - Etiquette: ${agent.qualityMetrics.phoneEtiquette}
      - Product Knowledge: ${agent.qualityMetrics.productKnowledge}
      - Upselling: ${agent.qualityMetrics.promotionUpselling}
      - Problem Solving: ${agent.qualityMetrics.problemSolving}
      
      Focus on their lowest quality scores if any are below 80.
      Format as a simple markdown list. Be direct and helpful.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No tips available.";
  } catch (error: any) {
    console.error("Error generating tips:", error);
    // If API call fails, fallback to mock data
    return getMockTips(agent.name);
  }
};