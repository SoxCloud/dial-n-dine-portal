import { Agent, AgentStatus, UserRole } from '../types';
import { MOCK_AGENTS } from '../constants';

// Helper to safely parse CSV lines handling quotes
const parseCSVLine = (text: string) => {
  const result = [];
  let cell = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cell.trim());
      cell = '';
    } else {
      cell += char;
    }
  }
  result.push(cell.trim());
  return result;
};

export const fetchSheetData = async (sheetIdOrUrl: string): Promise<Agent[]> => {
  try {
    let url = sheetIdOrUrl.trim();
    
    // LOGIC: Handle different types of Google Sheet URLs
    const isPublishToWeb = url.includes('/d/e/');
    const standardIdMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);

    // Case 1: Standard Browser URL (e.g. .../edit#gid=0)
    // We convert this to an export URL. NOTE: Sheet must be shared "Anyone with link" -> "Viewer"
    if (standardIdMatch && !isPublishToWeb) {
      const id = standardIdMatch[1];
      url = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`;
    } 
    // Case 2: User provided just the ID
    else if (!url.startsWith('http')) {
       url = `https://docs.google.com/spreadsheets/d/${url}/export?format=csv`;
    }
    // Case 3: Publish to Web URL
    else if (isPublishToWeb) {
      // Ensure we get CSV format
      if (url.includes('/pubhtml')) {
        url = url.replace('/pubhtml', '/pub?output=csv');
      } else if (!url.includes('output=csv')) {
         const separator = url.includes('?') ? '&' : '?';
         url = `${url}${separator}output=csv`;
      }
    }

    console.log("Fetching sheet data from:", url);

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: Server returned ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Link returned a Webpage (HTML) instead of Data (CSV). Please check sharing permissions (Must be "Anyone with the link" OR "Publish to Web").');
    }

    const csvText = await response.text();
    
    // Double check it's not HTML disguised
    if (csvText.trim().toLowerCase().startsWith('<!doctype html') || csvText.includes('<html')) {
        throw new Error('Received HTML content. Please ensure the sheet is publicly accessible via the link.');
    }

    const lines = csvText.split('\n');
    if (lines.length < 2) {
        throw new Error('CSV file appears empty or missing headers.');
    }

    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());

    // Map column names to indices
    const colMap: Record<string, number> = {};
    headers.forEach((h, i) => {
      if (h.includes('name')) colMap.name = i;
      if (h.includes('email')) colMap.email = i;
      if (h.includes('calls taken')) colMap.calls = i;
      if (h.includes('aht')) colMap.aht = i;
      if (h.includes('csat')) colMap.csat = i;
      if (h.includes('total tickets')) colMap.tickets = i;
      if (h.includes('solved tickets')) colMap.solved = i;
      if (h.includes('interactions')) colMap.interactions = i;
      if (h.includes('resolution time')) colMap.resTime = i;
      if (h.includes('evaluation: info')) colMap.qaInfo = i;
      if (h.includes('evaluation: etiqu')) colMap.qaEtiquette = i;
      if (h.includes('evaluation: prob')) colMap.qaProblem = i;
      if (h.includes('evaluation: prod')) colMap.qaProduct = i;
      if (h.includes('evaluation: upse')) colMap.qaUpsell = i;
    });

    const sheetAgents: Agent[] = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      if (row.length < 3) continue; // Skip empty rows

      const name = row[colMap.name];
      const email = row[colMap.email];
      
      // Find existing mock agent to preserve Avatar/ID/Status/Role if possible
      const existing = MOCK_AGENTS.find(a => a.email.toLowerCase() === email?.toLowerCase()) || 
                       MOCK_AGENTS.find(a => a.name.toLowerCase() === name?.toLowerCase());

      const agent: Agent = {
        id: existing?.id || `sheet-${i}`,
        name: name || 'Unknown Agent',
        email: email || 'no-email@dialndine.com',
        role: existing?.role || UserRole.AGENT,
        avatarUrl: existing?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random`,
        status: existing?.status || AgentStatus.OFFLINE,
        department: existing?.department || 'Helpdesk',
        shiftStart: existing?.shiftStart || '09:00 AM',
        metrics: {
          callsTaken: parseInt(row[colMap.calls] || '0'),
          avgHandleTime: parseInt(row[colMap.aht] || '0'),
          csatScore: parseFloat(row[colMap.csat] || '0'),
          resolutionRate: parseInt(row[colMap.tickets] || '0') > 0 
            ? Math.round((parseInt(row[colMap.solved] || '0') / parseInt(row[colMap.tickets] || '1')) * 100)
            : 0,
          totalTickets: parseInt(row[colMap.tickets] || '0'),
          ticketsSolved: parseInt(row[colMap.solved] || '0'),
          interactions: parseInt(row[colMap.interactions] || '0'),
          avgResolutionTime: parseFloat(row[colMap.resTime] || '0')
        },
        qualityMetrics: {
          capturingInformation: parseInt(row[colMap.qaInfo] || '0'),
          phoneEtiquette: parseInt(row[colMap.qaEtiquette] || '0'),
          problemSolving: parseInt(row[colMap.qaProblem] || '0'),
          productKnowledge: parseInt(row[colMap.qaProduct] || '0'),
          promotionUpselling: parseInt(row[colMap.qaUpsell] || '0')
        }
      };

      sheetAgents.push(agent);
    }

    return sheetAgents;

  } catch (error) {
    console.error("Failed to parse sheet data", error);
    throw error;
  }
};