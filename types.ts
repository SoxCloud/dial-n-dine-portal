export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT'
}

export enum AgentStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  BUSY = 'BUSY'
}

export interface DailyStats {
  date: string;
  answeredCalls: number;
  abandonedCalls: number;
  transactions: number;
  aht: string;
  resolutionRate: number;
}

export interface AgentEval {
  date: string;
  evaluator: string;
  score: number;
  positivePoints: string;
  improvementAreas: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AgentStatus;
  avatarUrl: string;
  history: DailyStats[];
  evaluations: AgentEval[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
}

export interface Evaluation {
  evaluations: {
    score: number;
    comments?: string; // ADD THIS LINE
    kpis: {
      capture: number;
      etiquette: number;
      solving: number;
      product: number;
      promo: number;
      upsell: number;
    };
  }[];
}