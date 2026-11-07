export type InkTheme = 'phosphor' | 'matrix' | 'vintage' | 'mint' | 'parchment';

export interface InkColorConfig {
  id: InkTheme;
  name: string;
  bgClass: string;
  panelClass: string;
  textClass: string;
  borderClass: string;
  accentClass: string;
  glowColor: string;
  hex: string;
  isLight?: boolean;
}

export interface StreamLogEntry {
  id: number;
  value: string;
  stepDiff: string;
  timestamp: number;
  iteration: bigint;
}

export interface CosmicBenchmark {
  name: string;
  exponent: number;
  scientific: string;
  description: string;
  category: 'astronomy' | 'physics' | 'computation' | 'earth';
}
