import { Agent, AgentStatus, UserRole } from '../types';

const SHEET_ID = '1_MEcMoGiXuYhmxwKv0-Cc0SryMYVIpVOMO6ea2MrKwY';

/**
 * HELPER: Specifically handles DD/MM/YYYY from Google Sheets
 * and converts it to YYYY-MM-DD for the Dashboard Logic.
 */
const normalizeDate = (dateStr: string): string => {
  if (!dateStr || dateStr === 'undefined' || dateStr.trim() === '') return '';
  
  // Clean the string (remove any trailing spaces or hidden characters)
  const cleanDate = dateStr.trim();

  if (cleanDate.includes('/')) {
    const parts = cleanDate.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      let year = parts[2];
      
      // Handle 2-digit years (e.g., "26" -> "2026")
      if (year.length === 2) year = `20${year}`;
      
      return `${year}-${month}-${day}`;
    }
  }
  return cleanDate; // Fallback if already in correct format
};

async function fetchTabCsv(tabName: string) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${tabName}`;
  const response = await fetch(url);
  const text = await response.text();
  return text.split('\n').map(row => 
    row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(cell => cell.replace(/"/g, '').trim())
  );
}

export const fetchAllDashboardData = async () => {
  const [agentData, evalData, metricData] = await Promise.all([
    fetchTabCsv('Agents'),
    fetchTabCsv('CallEvaluations'),
    fetchTabCsv('TicketMetrics')
  ]);

  const agentsMap: Record<string, Agent> = {};

  // 1. Process Evaluations
  evalData.slice(1).forEach(row => {
    const [name, email, , date, evaluator, , , , , , , , , positive, improvement, rating] = row;
    if (!email) return;

    if (!agentsMap[email]) {
      agentsMap[email] = {
        id: email,
        name,
        email,
        role: UserRole.AGENT,
        status: AgentStatus.OFFLINE,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        history: [],
        evaluations: []
      };
    }

    agentsMap[email].evaluations.push({
      date: normalizeDate(date),
      evaluator,
      score: parseFloat(rating) || 0,
      positivePoints: positive || 'Great performance.',
      improvementAreas: improvement || 'Continue following current protocols.'
    });
  });

  // 2. Process Daily Stats
  agentData.slice(1).forEach(row => {
    const [name, date, answered, abandoned, transactions] = row;
    const agent = Object.values(agentsMap).find(a => a.name === name);
    if (agent) {
      agent.history.push({
        date: normalizeDate(date),
        answeredCalls: parseInt(answered) || 0,
        abandonedCalls: parseInt(abandoned) || 0,
        transactions: parseInt(transactions) || 0,
        aht: '0s',
        resolutionRate: 0
      });
    }
  });

  // 3. Process Metrics
  metricData.slice(1).forEach(row => {
    const [name, , , aht, , , resolution, , , , date] = row;
    const agent = Object.values(agentsMap).find(a => a.name === name);
    const targetDate = normalizeDate(date);
    const dayStats = agent?.history.find(h => h.date === targetDate);
    if (dayStats) {
      dayStats.aht = aht || '0s';
      dayStats.resolutionRate = parseFloat(resolution) || 0;
    }
  });

  return {
    agents: Object.values(agentsMap),
    availableDates: [...new Set(agentData.slice(1).map(row => normalizeDate(row[1])))].filter(Boolean)
  };
};