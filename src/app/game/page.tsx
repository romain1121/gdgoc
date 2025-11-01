"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import type { Difficulty, Bug, BugType } from "@/utils/types";
import { GAME_CONFIG, MAX_BUGS_COUNT, BUG_PROBABILITIES, GAME_DURATION } from "@/utils/gameConfig";
import { submitScore, getRankings } from "@/apis/score";
import GameArea from "@/components/GameArea";
import GameInfo from "@/components/GameInfo";
import RankingPanel from "@/components/RankingPanel";
import type { RankEntry } from "@/utils/types";

const BUG_SCORES: Record<BugType, number> = {
  normalMosquito: 1,
  malariaMosquito: 3,
  bee: -5,
};

export default function GamePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [gameState, setGameState] = useState<"waiting" | "countdown" | "playing" | "ended">("waiting");
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [ranks, setRanks] = useState<RankEntry[]>([]);
  const [isLoadingRankings, setIsLoadingRankings] = useState(true);
  const [gameStartTime, setGameStartTime] = useState<number>(0);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bugMovementRef = useRef<NodeJS.Timeout | null>(null);
  const bugIdCounterRef = useRef(0);

  // 랭킹 조회
  const fetchRankings = useCallback(async (diff: Difficulty) => {
    try {
      setIsLoadingRankings(true);
      const response = await getRankings(diff);
      if (response.success && response.ranks) {
        setRanks(response.ranks);
      } else {
        setRanks([]);
      }
    } catch (error) {
      console.error("랭킹 조회 실패:", error);
      setRanks([]);
    } finally {
      setIsLoadingRankings(false);
    }
  }, []);

  // 파라미터 초기화
  useEffect(() => {
    const nameParam = searchParams.get("name");
    const difficultyParam = searchParams.get("difficulty") as Difficulty | null;

    if (!nameParam || !difficultyParam) {
      router.push("/");
      return;
    }

    setName(nameParam);
    setDifficulty(difficultyParam);
    fetchRankings(difficultyParam);
  }, [searchParams, router, fetchRankings]);

  // 벌레 타입 랜덤 생성
  const getRandomBugType = (): BugType => {
    const rand = Math.random();
    if (rand < BUG_PROBABILITIES.normalMosquito) {
      return "normalMosquito";
    } else if (rand < BUG_PROBABILITIES.normalMosquito + BUG_PROBABILITIES.malariaMosquito) {
      return "malariaMosquito";
    } else {
      return "bee";
    }
  };

  // 벌레 생성
  const spawnBug = useCallback(() => {
    if (!difficulty || !gameAreaRef.current) return;

    const container = gameAreaRef.current;
    const containerRect = container.getBoundingClientRect();
    const maxX = containerRect.width - 50;
    const maxY = containerRect.height - 50;

    const config = GAME_CONFIG[difficulty];
    const baseSpeed = 0.5 * config.speed;
    
    const newBug: Bug = {
      id: `bug-${bugIdCounterRef.current++}`,
      type: getRandomBugType(),
      x: Math.random() * maxX + 25,
      y: Math.random() * maxY + 25,
      vx: (Math.random() - 0.5) * baseSpeed,
      vy: (Math.random() - 0.5) * baseSpeed,
    };

    setBugs((prev) => {
      const currentCount = prev.length;
      const maxCount = MAX_BUGS_COUNT[difficulty];
      
      if (currentCount >= maxCount) {
        // 최대 개수 초과 시 가장 오래된 벌레 제거
        return [...prev.slice(1), newBug];
      }
      return [...prev, newBug];
    });
  }, [difficulty]);

  // 벌레 이동 처리
  useEffect(() => {
    if (gameState !== "playing" || !difficulty || !gameAreaRef.current) {
      return;
    }

    const container = gameAreaRef.current;
    const containerRect = container.getBoundingClientRect();
    const maxX = containerRect.width - 25;
    const maxY = containerRect.height - 25;

    bugMovementRef.current = setInterval(() => {
      setBugs((prev) =>
        prev.map((bug) => {
          let newX = bug.x + bug.vx;
          let newY = bug.y + bug.vy;

          // 경계 처리 (튕김 효과)
          if (newX <= 25 || newX >= maxX) {
            newX = bug.x;
            return { ...bug, vx: -bug.vx, x: newX };
          }
          if (newY <= 25 || newY >= maxY) {
            newY = bug.y;
            return { ...bug, vy: -bug.vy, y: newY };
          }

          return { ...bug, x: newX, y: newY };
        })
      );
    }, 16); // 약 60fps

    return () => {
      if (bugMovementRef.current) {
        clearInterval(bugMovementRef.current);
      }
    };
  }, [gameState, difficulty]);

  // 벌레 클릭 처리
  const handleBugClick = useCallback(
    (bugId: string) => {
      if (gameState !== "playing") return;

      setBugs((prev) => {
        const clickedBug = prev.find((b) => b.id === bugId);
        if (clickedBug) {
          const points = BUG_SCORES[clickedBug.type];
          setScore((prevScore) => Math.max(0, prevScore + points)); // 점수는 0 아래로 내려가지 않음
        }
        return prev.filter((b) => b.id !== bugId);
      });
    },
    [gameState]
  );

  // 게임 시작 (카운트다운)
  const handleStartGame = () => {
    setGameState("countdown");
    setCountdown(3);
  };

  // 카운트다운 처리
  useEffect(() => {
    if (gameState !== "countdown") return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // 게임 시작
      setGameState("playing");
      setTimeRemaining(GAME_DURATION);
      setScore(0);
      setBugs([]);
      setGameStartTime(Date.now());
      spawnBug(); // 첫 벌레 즉시 생성
    }
  }, [gameState, countdown, spawnBug]);

  // 벌레 생성 인터벌
  useEffect(() => {
    if (gameState !== "playing" || !difficulty) {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }
      return;
    }

    const config = GAME_CONFIG[difficulty];
    spawnIntervalRef.current = setInterval(() => {
      spawnBug();
    }, config.spawnInterval);

    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    };
  }, [gameState, difficulty, spawnBug]);

  // 게임 타이머
  useEffect(() => {
    if (gameState !== "playing") {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
        gameTimerRef.current = null;
      }
      return;
    }

    gameTimerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // 게임 종료
          setGameState("ended");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, [gameState]);

  // 게임 종료 처리
  useEffect(() => {
    if (gameState !== "ended" || !name || !difficulty) return;

    const elapsedTime = (Date.now() - gameStartTime) / 1000; // 초 단위
    const totalTime = GAME_DURATION - timeRemaining;

    // 점수 제출
    submitScore({
      name,
      difficulty,
      score,
      time: totalTime > 0 ? totalTime : elapsedTime,
    })
      .then((response) => {
        if (response.success) {
          // 랭킹 갱신
          fetchRankings(difficulty);
          alert(`게임 종료!\n점수: ${score}점\n랭크: ${response.rank || "-"}위`);
        }
      })
      .catch((error) => {
        console.error("점수 제출 실패:", error);
        alert("점수 제출에 실패했습니다.");
      });
  }, [gameState, name, difficulty, score, timeRemaining, gameStartTime, fetchRankings]);

  if (!name || !difficulty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            🦟 Catch the Mosquito!
          </h1>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            홈으로
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* 게임 영역 */}
          <div className="lg:col-span-3">
            {gameState === "waiting" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                  게임 준비 완료!
                </h2>
                <button
                  onClick={handleStartGame}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-green-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  게임 시작
                </button>
              </div>
            )}

            {gameState === "countdown" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg text-center">
                <div className="text-8xl font-bold text-blue-500 animate-pulse">
                  {countdown}
                </div>
                <p className="text-xl mt-4 text-gray-600 dark:text-gray-300">
                  게임이 곧 시작됩니다!
                </p>
              </div>
            )}

            {gameState === "playing" && (
              <GameArea
                ref={gameAreaRef}
                bugs={bugs}
                onBugClick={handleBugClick}
                gameStarted={true}
              />
            )}

            {gameState === "ended" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                  게임 종료!
                </h2>
                <p className="text-2xl mb-4 text-blue-600 dark:text-blue-400">
                  최종 점수: {score}점
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => {
                      setGameState("waiting");
                      setScore(0);
                      setTimeRemaining(GAME_DURATION);
                      setBugs([]);
                    }}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                  >
                    다시 시작
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    홈으로
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <div className="space-y-4">
            <GameInfo
              name={name}
              difficulty={difficulty}
              score={score}
              timeRemaining={timeRemaining}
            />
            <RankingPanel
              ranks={ranks}
              difficulty={difficulty.toUpperCase()}
              isLoading={isLoadingRankings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
