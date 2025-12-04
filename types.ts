export enum Direction {
  LONG = 'Long',
  SHORT = 'Short',
}

export enum Outcome {
  WIN = 'Win',
  LOSS = 'Loss',
  BE = 'Break Even',
  PENDING = 'Pending',
}

export interface Trade {
  id: string;
  pair: string;
  date: string;
  direction: Direction;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  outcome: Outcome;
  pnl?: number; // Profit and Loss in currency or %
  notes: string;
  tags: string[]; // e.g., "Macro Trend", "4H Supply"
  checklistCompleted: boolean;
}

export interface StrategyStep {
  id: number;
  title: string;
  description: string;
  isConfirmed: boolean;
  notes: string;
}

export interface ChecklistState {
  macroTrend: boolean;
  retracementChoC: boolean;
  structureShift: boolean;
  supplyDemandZone: boolean;
  entryRisk: boolean;
  pair: string;
  timeframe: string;
}

export interface AIAdviceResponse {
  advice: string;
  tone: 'encouraging' | 'cautionary' | 'analytical';
}