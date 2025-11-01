import type { Difficulty } from "@/utils/types";

interface GameInfoProps {
  name: string;
  difficulty: Difficulty;
  score: number;
  timeRemaining: number;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export default function GameInfo({
  name,
  difficulty,
  score,
  timeRemaining,
}: GameInfoProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
        게임 정보
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">유저:</span>
          <span className="font-medium text-gray-800 dark:text-white">{name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">난이도:</span>
          <span className="font-medium text-gray-800 dark:text-white">
            {DIFFICULTY_LABELS[difficulty]}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">점수:</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">{score}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">남은 시간:</span>
          <span
            className={`font-bold ${
              timeRemaining <= 10 ? "text-red-500" : "text-green-600 dark:text-green-400"
            }`}
          >
            {timeDisplay}
          </span>
        </div>
      </div>
    </div>
  );
}

