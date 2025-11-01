export type Difficulty = "easy" | "medium" | "hard";

export interface GameConfig {
  difficulty: Difficulty;
  speed: number; // 이동 속도 배율
  spawnInterval: number; // 등장 빈도 (밀리초)
}

export interface GameState {
  name: string;
  difficulty: Difficulty;
  score: number;
  timeRemaining: number;
}

export interface RankEntry {
  rank: number;
  name: string;
  score: number;
  time: number;
}

export interface SubmitScoreRequest {
  name: string;
  difficulty: Difficulty;
  score: number;
  time: number;
}

export interface SubmitScoreResponse {
  success: boolean;
  message?: string;
  user?: {
    name: string;
    difficulty: Difficulty;
    score: number;
    time: number;
  };
  rank?: number;
}

export interface RankResponse {
  success: boolean;
  difficulty: Difficulty;
  ranks: RankEntry[];
  message?: string;
}

export type BugType = "normalMosquito" | "malariaMosquito" | "bee";

export interface Bug {
  id: string;
  type: BugType;
  x: number;
  y: number;
  vx: number; // x축 속도
  vy: number; // y축 속도
}
