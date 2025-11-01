import type { RankEntry } from "@/utils/types";

interface RankingPanelProps {
  ranks: RankEntry[];
  difficulty: string;
  isLoading?: boolean;
}

export default function RankingPanel({
  ranks,
  difficulty,
  isLoading = false,
}: RankingPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
          랭킹 ({difficulty})
        </h3>
        <div className="text-center text-gray-500 dark:text-gray-400">
          로딩 중...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
        랭킹 ({difficulty})
      </h3>
      {ranks.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          아직 기록이 없습니다.
        </div>
      ) : (
        <div className="space-y-2">
          {ranks.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-700 dark:text-gray-300 w-6">
                  {entry.rank}
                </span>
                <span className="text-gray-800 dark:text-white">{entry.name}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  {entry.score}점
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {entry.time.toFixed(1)}초
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

