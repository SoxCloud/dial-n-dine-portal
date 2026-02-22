import { Agent, AgentStatus, UserRole } from '../types';

const SHEET_ID = '1_MEcMoGiXuYhmxwKv0-Cc0SryMYVIpVOMO6ea2MrKwY';

// HELPER: Matches "Claire M" to "Claire Makeleni"
const getFirstName = (name: string) => name.trim().split(' ')[0].toLowerCase();

const normalizeDate = (dateStr: string): string => {
  if (!dateStr || dateStr.includes('Date')) return '';
  const cleanDate = dateStr.trim();
  if (cleanDate.includes('/')) {
    const parts = cleanDate.split('/');
    if (parts.length === 3) {
      const d = parts[0].padStart(2, '0');
      const m = parts[1].padStart(2, '0');
      const y = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
      return `${y}-${m}-${d}`;
    }
  }
  return cleanDate;
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
  const [agentStats, evalData, metricData] = await Promise.all([
    fetchTabCsv('Agents'),
    fetchTabCsv('CallEvaluations'),
    fetchTabCsv('TicketMetrics')
  ]);

  const agentsMap: Record<string, Agent> = {};

  // 1. CREATE AGENTS from the main Agents tab (Image_141735)
  agentStats.slice(1).forEach(row => {
    const [name] = row;
    if (!name || name === 'Agent') return;
    
    if (!agentsMap[name]) {
      agentsMap[name] = {
        id: name, name, email: `${getFirstName(name)}@dialndine.com`, // Fallback email
        role: UserRole.AGENT, status: AgentStatus.OFFLINE,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        history: [], evaluations: []
      };
    }
    
    const [,, answered, abandoned, transactions] = row;
    agentsMap[name].history.push({
      date: normalizeDate(row[1]),
      answeredCalls: parseInt(answered) || 0,
      abandonedCalls: parseInt(abandoned) || 0,
      transactions: parseInt(transactions) || 0,
      aht: '0s', resolutionRate: 0
    });
  });

  // 2. MERGE EVALUATIONS (Image_141a5a)
  evalData.slice(1).forEach(row => {
    const [name, email] = row;
    const date = normalizeDate(row[3]);
    
    // Find agent by full name or first name match
    const agent = Object.values(agentsMap).find(a => 
      a.name === name || getFirstName(a.name) === getFirstName(name)
    );

    if (agent) {
      if (email) agent.email = email; // Update to real email from this tab
      agent.evaluations.push({
        date,
        evaluator: row[4],
        score: (parseFloat(row[16]) / 5) * 100,
        positivePoints: row[13],
        improvementAreas: row[14],
        kpis: {
          product: parseInt(row[7]) || 0,
          etiquette: parseInt(row[8]) || 0,
          solving: parseInt(row[9]) || 0,
          upsell: parseInt(row[10]) || 0,
          promo: parseInt(row[11]) || 0,
          capture: parseInt(row[12]) || 0
        }
      });
    }
  });

  // 3. MERGE TICKET METRICS (AHT) (Image_141d9a)
  metricData.slice(1).forEach(row => {
    const [name,,,aht,,,resolution,,,,dateStr] = row;
    const date = normalizeDate(dateStr);
    const agent = Object.values(agentsMap).find(a => 
      a.name === name || getFirstName(a.name) === getFirstName(name)
    );
    
    const dayData = agent?.history.find(h => h.date === date);
    if (dayData) {
      dayData.aht = aht || '0s';
      dayData.resolutionRate = parseFloat(resolution) || 0;
    }
  });

  return { agents: Object.values(agentsMap) };
};