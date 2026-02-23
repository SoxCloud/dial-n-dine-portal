export enum UserRole {
  ADMIN = "ADMIN",
  AGENT = "AGENT",
}

export enum AgentStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  BUSY = "BUSY",
  ON_CALL = "ON_CALL",
  AWAY = "AWAY",
}

export interface DailyStats {
  date: string;
  answeredCalls: number;
  abandonedCalls: number;
  transactions: number;
  aht: string;
  resolutionRate: number;
  missedCalls?: number;
  solvedTickets?: number;
}

export interface Kpis {
  capture: number;
  etiquette: number;
  solving: number;
  product: number;
  promo?: number;
  upsell?: number;
}

export interface AgentEval {
  kpis: Kpis;
  date: string;
  evaluator?: string;
  score: number;
  positivePoints?: string;
  improvementAreas?: string;
  comments?: string;
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
  department?: string;
  shiftStart?: string;
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
