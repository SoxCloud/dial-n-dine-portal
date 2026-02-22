import { Agent, AgentStatus, UserRole } from '../types';

const SHEET_ID = '1_MEcMoGiXuYhmxwKv0-Cc0SryMYVIpVOMO6ea2MrKwY';

async function fetchTabCsv(tabName: string) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${tabName}`;
  const response = await fetch(url);
  const text = await response.text();
  return text.split('\n').map(row => row.split(',').map(cell => cell.replace(/"/g, '')));
}

export const fetchAllDashboardData = async () => {
  const [agentData, evalData, metricData] = await Promise.all([
    fetchTabCsv('Agents'),
    fetchTabCsv('CallEvaluations'),
    fetchTabCsv('TicketMetrics')
  ]);

  const agentsMap: Record<string, Agent> = {};

  // Process CallEvaluations first to get emails/names (Login source)
  evalData.slice(1).forEach(row => {
    const [name, email, , date, evaluator, , , , , , , , , positive, improvement, rating] = row;
    if (!email) return;

    if (!agentsMap[email]) {
      agentsMap[email] = {
        id: email,
        name: name,
        email: email,
        role: UserRole.AGENT,
        status: AgentStatus.OFFLINE,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        history: [],
        evaluations: []
      };
    }

    agentsMap[email].evaluations.push({
      date,
      evaluator,
      score: parseFloat(rating) || 0,
      positivePoints: positive,
      improvementAreas: improvement
    });
  });

  // Process Agents tab (Calls/Transactions)
  agentData.slice(1).forEach(row => {
    const [name, date, answered, abandoned, transactions] = row;
    const agent = Object.values(agentsMap).find(a => a.name === name);
    if (agent) {
      agent.history.push({
        date,
        answeredCalls: parseInt(answered) || 0,
        abandonedCalls: parseInt(abandoned) || 0,
        transactions: parseInt(transactions) || 0,
        aht: '00:00', // Placeholder for merge
        resolutionRate: 0
      });
    }
  });

  // Process TicketMetrics tab (AHT/Resolution)
  metricData.slice(1).forEach(row => {
    const [name, , , aht, , , resolution, , , , date] = row;
    const agent = Object.values(agentsMap).find(a => a.name === name);
    const dayStats = agent?.history.find(h => h.date === date);
    if (dayStats) {
      dayStats.aht = aht;
      dayStats.resolutionRate = parseFloat(resolution) || 0;
    }
  });

  return {
    agents: Object.values(agentsMap),
    availableDates: [...new Set(agentData.slice(1).map(row => row[1]))].sort()
  };
};