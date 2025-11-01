"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Difficulty } from "@/utils/types";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const router = useRouter();

  const handleStart = () => {
    if (!name.trim()) {
      alert("이름을 입력해주세요!");
      return;
    }
    // 게임 화면으로 이동 (쿼리 파라미터로 전달)
    router.push(`/game?name=${encodeURIComponent(name)}&difficulty=${difficulty}`);
  };

  const difficultyOptions: { value: Difficulty; label: string; description: string }[] = [
    { value: "easy", label: "Easy", description: "이동 속도: 느림 | 등장 빈도: 2초마다" },
    { value: "medium", label: "Medium", description: "이동 속도: 중간 | 등장 빈도: 1.5초마다" },
    { value: "hard", label: "Hard", description: "이동 속도: 빠름 | 등장 빈도: 1초마다" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md px-6 py-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        {/* 제목 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            🦟 Catch the Mosquito!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            순발력을 테스트하는 미니게임
          </p>
        </div>

        {/* 게임 설명 */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            게임 방법
          </h2>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>• 1분 동안 화면에 나타나는 모기를 잡으세요!</li>
            <li>• 일반 모기: +1점</li>
            <li>• 말라리아 모기: +3점</li>
            <li>• 벌: -5점 (주의!)</li>
          </ul>
        </div>

        {/* 이름 입력 */}
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            유저 이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleStart();
              }
            }}
          />
        </div>

        {/* 난이도 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            난이도 선택
          </label>
          <div className="space-y-2">
            {difficultyOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  difficulty === option.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={option.value}
                  checked={difficulty === option.value}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800 dark:text-white">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {option.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 게임 시작 버튼 */}
        <button
          onClick={handleStart}
          disabled={!name.trim()}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
            name.trim()
              ? "bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
          }`}
        >
          게임 시작 🎮
        </button>
      </div>
    </div>
  );
}

