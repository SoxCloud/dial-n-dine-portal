import { Agent, AgentStatus, UserRole } from './types';

// ==============================================================================
// ⚙️ SYSTEM CONFIGURATION
// ==============================================================================

// OPTION A: GOOGLE SHEETS (AUTOMATIC)
// 1. Publish your Google Sheet to Web (File > Share > Publish to web > CSV).
// 2. Paste the link inside the quotes below.
// 3. The app will automatically load data from there.
export const GOOGLE_SHEET_ID = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQD959UiBDL42jofQwxD6K6O0YeRSSu6csKfg15kxFceRcXqPDSGbecdXgtcdfn8cd-Lz5DBqAu-1Ij/pub?output=csv
"; 

export const APP_NAME = "OmniDesk Portal";

// OPTION B: MANUAL ROSTER (FALLBACK)
// If you leave GOOGLE_SHEET_ID empty above, the app will use this list.
// You can edit the agents below to match your actual team.
// IMPORTANT: The 'email' field is what agents use to log in.
export const MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@dialndine.com', // LOGIN EMAIL
    role: UserRole.AGENT,
    avatarUrl: 'https://picsum.photos/200/200?random=1',
    status: AgentStatus.ON_CALL,
    department: 'Helpdesk',
    shiftStart: '08:00 AM',
    metrics: {
      callsTaken: 45,
      avgHandleTime: 240,
      csatScore: 4.8,
      resolutionRate: 92,
      totalTickets: 50,
      ticketsSolved: 46,
      interactions: 145,
      avgResolutionTime: 2.5
    },
    qualityMetrics: {
      capturingInformation: 95,
      phoneEtiquette: 98,
      problemSolving: 90,
      productKnowledge: 92,
      promotionUpselling: 85
    }
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@dialndine.com',
    role: UserRole.AGENT,
    avatarUrl: 'https://picsum.photos/200/200?random=2',
    status: AgentStatus.ONLINE,
    department: 'Helpdesk',
    shiftStart: '08:00 AM',
    metrics: {
      callsTaken: 52,
      avgHandleTime: 180,
      csatScore: 4.5,
      resolutionRate: 88,
      totalTickets: 60,
      ticketsSolved: 53,
      interactions: 180,
      avgResolutionTime: 1.8
    },
    qualityMetrics: {
      capturingInformation: 88,
      phoneEtiquette: 90,
      problemSolving: 95,
      productKnowledge: 85,
      promotionUpselling: 70
    }
  },
  {
    id: '3',
    name: 'Jessica Dubrow',
    email: 'jessica.d@dialndine.com',
    role: UserRole.AGENT,
    avatarUrl: 'https://picsum.photos/200/200?random=3',
    status: AgentStatus.AWAY,
    department: 'Helpdesk',
    shiftStart: '09:00 AM',
    metrics: {
      callsTaken: 30,
      avgHandleTime: 310,
      csatScore: 4.9,
      resolutionRate: 95,
      totalTickets: 35,
      ticketsSolved: 33,
      interactions: 110,
      avgResolutionTime: 3.2
    },
    qualityMetrics: {
      capturingInformation: 98,
      phoneEtiquette: 95,
      problemSolving: 88,
      productKnowledge: 95,
      promotionUpselling: 60
    }
  },
  // Add more agents here by copying the block above...
  {
    id: 'admin',
    name: 'Call Center Admin',
    email: 'callcenter@dialndine.com',
    role: UserRole.ADMIN,
    avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=0e8de9&color=fff',
    status: AgentStatus.ONLINE,
    department: 'Management',
    shiftStart: '07:00 AM',
    metrics: {
      callsTaken: 0,
      avgHandleTime: 0,
      csatScore: 5.0,
      resolutionRate: 100,
      totalTickets: 0,
      ticketsSolved: 0,
      interactions: 0,
      avgResolutionTime: 0
    },
    qualityMetrics: {
      capturingInformation: 100,
      phoneEtiquette: 100,
      problemSolving: 100,
      productKnowledge: 100,
      promotionUpselling: 100
    }
  }
];