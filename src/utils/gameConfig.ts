import type { Difficulty, GameConfig } from "./types";

export const GAME_CONFIG: Record<Difficulty, GameConfig> = {
  easy: {
    difficulty: "easy",
    speed: 1.0, // 느림
    spawnInterval: 2000, // 2초마다
  },
  medium: {
    difficulty: "medium",
    speed: 1.5, // 중간
    spawnInterval: 1500, // 1.5초마다
  },
  hard: {
    difficulty: "hard",
    speed: 2.0, // 빠름
    spawnInterval: 1000, // 1초마다
  },
};

// 난이도별 최대 벌레 개수
export const MAX_BUGS_COUNT: Record<Difficulty, number> = {
  easy: 3,
  medium: 5,
  hard: 7,
};

// 벌레 타입 확률 분포
export const BUG_PROBABILITIES = {
  normalMosquito: 0.7, // 70%
  malariaMosquito: 0.2, // 20%
  bee: 0.1, // 10%
};

// 게임 시간 (초)
export const GAME_DURATION = 60; // 1분

