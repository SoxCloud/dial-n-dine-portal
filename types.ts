export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT'
}

export enum AgentStatus {
  ONLINE = 'Online',
  AWAY = 'Away',
  ON_CALL = 'On Call',
  OFFLINE = 'Offline'
}

export interface QualityMetrics {
  capturingInformation: number; // 0-100
  phoneEtiquette: number;      // 0-100
  problemSolving: number;      // 0-100
  productKnowledge: number;    // 0-100
  promotionUpselling: number;  // 0-100
}

export interface PerformanceMetrics {
  callsTaken: number;
  avgHandleTime: number; // in seconds
  csatScore: number; // 1-5
  resolutionRate: number; // percentage
  
  // Ticket Stats
  totalTickets: number;
  ticketsSolved: number; // Previously ticketsClosed
  interactions: number;
  avgResolutionTime: number; // in hours
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  status: AgentStatus;
  department: string;
  metrics: PerformanceMetrics;
  qualityMetrics: QualityMetrics;
  shiftStart: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface SheetConfig {
  sheetId: string;
  sheetName: string;
  lastSynced: string;
}