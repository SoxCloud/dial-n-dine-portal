import { Agent, AgentStatus, UserRole } from './types';

export const MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@dialndine.com',
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
  {
    id: '4',
    name: 'David Miller',
    email: 'david.m@dialndine.com',
    role: UserRole.AGENT,
    avatarUrl: 'https://picsum.photos/200/200?random=4',
    status: AgentStatus.ONLINE,
    department: 'Helpdesk',
    shiftStart: '09:00 AM',
    metrics: {
      callsTaken: 38,
      avgHandleTime: 280,
      csatScore: 4.2,
      resolutionRate: 85,
      totalTickets: 45,
      ticketsSolved: 38,
      interactions: 130,
      avgResolutionTime: 2.8
    },
    qualityMetrics: {
      capturingInformation: 80,
      phoneEtiquette: 85,
      problemSolving: 82,
      productKnowledge: 90,
      promotionUpselling: 55
    }
  },
  {
    id: '5',
    name: 'Emily Wilson',
    email: 'emily.w@dialndine.com',
    role: UserRole.AGENT,
    avatarUrl: 'https://picsum.photos/200/200?random=5',
    status: AgentStatus.ON_CALL,
    department: 'Helpdesk',
    shiftStart: '08:00 AM',
    metrics: {
      callsTaken: 60,
      avgHandleTime: 150,
      csatScore: 4.0,
      resolutionRate: 80,
      totalTickets: 70,
      ticketsSolved: 56,
      interactions: 210,
      avgResolutionTime: 1.5
    },
    qualityMetrics: {
      capturingInformation: 85,
      phoneEtiquette: 80,
      problemSolving: 75,
      productKnowledge: 80,
      promotionUpselling: 90
    }
  },
  {
    id: '6',
    name: 'Robert Taylor',
    email: 'robert.t@dialndine.com',
    role: UserRole.AGENT,
    avatarUrl: 'https://picsum.photos/200/200?random=6',
    status: AgentStatus.OFFLINE,
    department: 'Helpdesk',
    shiftStart: '10:00 AM',
    metrics: {
      callsTaken: 12,
      avgHandleTime: 290,
      csatScore: 4.6,
      resolutionRate: 90,
      totalTickets: 15,
      ticketsSolved: 13,
      interactions: 40,
      avgResolutionTime: 2.9
    },
    qualityMetrics: {
      capturingInformation: 90,
      phoneEtiquette: 92,
      problemSolving: 85,
      productKnowledge: 88,
      promotionUpselling: 65
    }
  },
  {
    id: '7',
    name: 'Lisa Anderson',
    email: 'lisa.a@dialndine.com',
    role: UserRole.AGENT,
    avatarUrl: 'https://picsum.photos/200/200?random=7',
    status: AgentStatus.ONLINE,
    department: 'Helpdesk',
    shiftStart: '08:30 AM',
    metrics: {
      callsTaken: 48,
      avgHandleTime: 220,
      csatScore: 4.7,
      resolutionRate: 91,
      totalTickets: 55,
      ticketsSolved: 50,
      interactions: 160,
      avgResolutionTime: 2.1
    },
    qualityMetrics: {
      capturingInformation: 92,
      phoneEtiquette: 94,
      problemSolving: 89,
      productKnowledge: 90,
      promotionUpselling: 75
    }
  },
  {
    id: '8',
    name: 'James Moore',
    email: 'james.m@dialndine.com',
    role: UserRole.AGENT,
    avatarUrl: 'https://picsum.photos/200/200?random=8',
    status: AgentStatus.ONLINE,
    department: 'Helpdesk',
    shiftStart: '08:30 AM',
    metrics: {
      callsTaken: 41,
      avgHandleTime: 265,
      csatScore: 4.3,
      resolutionRate: 87,
      totalTickets: 48,
      ticketsSolved: 42,
      interactions: 135,
      avgResolutionTime: 2.6
    },
    qualityMetrics: {
      capturingInformation: 86,
      phoneEtiquette: 88,
      problemSolving: 84,
      productKnowledge: 86,
      promotionUpselling: 68
    }
  },
  {
    id: '9',
    name: 'William Brown',
    email: 'william.b@dialndine.com',
    role: UserRole.AGENT,
    avatarUrl: 'https://picsum.photos/200/200?random=9',
    status: AgentStatus.AWAY,
    department: 'Helpdesk',
    shiftStart: '09:30 AM',
    metrics: {
      callsTaken: 25,
      avgHandleTime: 300,
      csatScore: 4.8,
      resolutionRate: 94,
      totalTickets: 28,
      ticketsSolved: 26,
      interactions: 85,
      avgResolutionTime: 3.1
    },
    qualityMetrics: {
      capturingInformation: 96,
      phoneEtiquette: 97,
      problemSolving: 92,
      productKnowledge: 94,
      promotionUpselling: 50
    }
  }
];

export const APP_NAME = "OmniDesk Portal";