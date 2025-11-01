"use client";

import { forwardRef } from "react";
import Bug from "./Bug";
import type { Bug as BugType } from "@/utils/types";

interface GameAreaProps {
  bugs: BugType[];
  onBugClick: (id: string) => void;
  gameStarted: boolean;
}

const GameArea = forwardRef<HTMLDivElement, GameAreaProps>(
  ({ bugs, onBugClick, gameStarted }, ref) => {

    return (
      <div
        ref={ref}
        className="relative w-full h-full bg-gradient-to-br from-green-100 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden border-2 border-green-300 dark:border-gray-600"
        style={{ minHeight: "500px" }}
      >
        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-20">
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              게임 영역
            </p>
          </div>
        )}
        {bugs.map((bug) => (
          <Bug
            key={bug.id}
            type={bug.type}
            x={bug.x}
            y={bug.y}
            onClick={() => onBugClick(bug.id)}
          />
        ))}
      </div>
    );
  }
);

GameArea.displayName = "GameArea";

export default GameArea;

