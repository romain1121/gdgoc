import type { BugType } from "@/utils/types";

interface BugProps {
  type: BugType;
  x: number;
  y: number;
  onClick: () => void;
}

const BUG_EMOJIS: Record<BugType, string> = {
  normalMosquito: "🦟", // 일반 모기
  malariaMosquito: "🩸", // 말라리아 모기
  bee: "🪰", // 파리 (벌 대신)
};

const BUG_NAMES: Record<BugType, string> = {
  normalMosquito: "일반 모기",
  malariaMosquito: "말라리아 모기",
  bee: "파리",
};

export default function Bug({ type, x, y, onClick }: BugProps) {
  return (
    <div
      className="absolute cursor-pointer transition-transform hover:scale-110 active:scale-95 select-none z-10"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
      title={BUG_NAMES[type]}
    >
      <span className="text-4xl drop-shadow-lg">{BUG_EMOJIS[type]}</span>
    </div>
  );
}

