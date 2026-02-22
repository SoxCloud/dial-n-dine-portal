// services/sheetService.ts

const SHEET_ID = '1_MEcMoGiXuYhmxwKv0-Cc0SryMYVIpVOMO6ea2MrKwY';

// Helper to fetch and parse Google Sheets CSV format
const fetchTabCsv = async (tabName: string) => {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${tabName}`;
  const response = await fetch(url);
  const text = await response.text();
  
  // Basic CSV parser (handles quotes)
  const rows = text.split('\n').map(row => {
    return row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map(cell => cell.replace(/^"|"$/g, '')) || [];
  });
  
  return { headers: rows[0], data: rows.slice(1) };
};

export const fetchAllDashboardData = async () => {
  try {
    const [agentsRes, evalsRes, metricsRes] = await Promise.all([
      fetchTabCsv('Agents'),
      fetchTabCsv('CallEvaluations'),
      fetchTabCsv('TicketMetrics')
    ]);

    // Extract unique dates from the Agents tab (Index 1 is Date)
    const availableDates = [...new Set(agentsRes.data.map(row => row[1]).filter(Boolean))];

    // Extract unique agents
    const uniqueAgents = [...new Set(agentsRes.data.map(row => row[0]).filter(Boolean))];

    const agents = uniqueAgents.map(agentName => {
      // Get all rows for this specific agent across tabs
      const agentActivity = agentsRes.data.filter(row => row[0] === agentName);
      const agentEvals = evalsRes.data.filter(row => row[0] === agentName);
      const agentMetrics = metricsRes.data.filter(row => row[0] === agentName);

      // Create a daily history array so we can filter by date later
      const history = availableDates.map(date => {
        const activityForDate = agentActivity.find(row => row[1] === date) || [];
        const metricsForDate = agentMetrics.find(row => row[10] === date) || []; // Assuming date is col K (index 10)
        
        return {
          date,
          answered: parseInt(activityForDate[2] || '0', 10),
          abandoned: parseInt(activityForDate[3] || '0', 10),
          transactions: parseInt(activityForDate[4] || '0', 10),
          aht: metricsForDate[3] || "00:00:00",
          resolutionRate: parseInt(metricsForDate[6] || '0', 10)
        };
      });

      return {
        id: agentName.toLowerCase().replace(/\s/g, '-'),
        name: agentName,
        email: agentEvals[0]?.[1] || `${agentName.split(' ')[0].toLowerCase()}@dialndine.com`,
        status: 'OFFLINE',
        history, // Store the daily breakdown here
        // We calculate an overall average rating from the CallEvaluations tab (Index 16 is overallRating)
        overallRating: agentEvals.length 
          ? (agentEvals.reduce((sum, row) => sum + parseFloat(row[16] || '0'), 0) / agentEvals.length).toFixed(1)
          : "0.0"
      };
    });

    return { agents, availableDates };
  } catch (error) {
    console.error("Error fetching Google Sheet data:", error);
    return { agents: [], availableDates: [] };
  }
};
