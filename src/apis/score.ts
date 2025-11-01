import type {
  SubmitScoreRequest,
  SubmitScoreResponse,
  RankResponse,
  Difficulty,
} from "@/utils/types";

const BASE_URL = "https://port-0-gdgoc-back-mhg0mhul3fb7a201.sel3.cloudtype.app";

export async function submitScore(
  data: SubmitScoreRequest
): Promise<SubmitScoreResponse> {
  const response = await fetch(`${BASE_URL}/api/score/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`점수 제출 실패: ${response.status}`);
  }

  return response.json();
}

export async function getRankings(
  difficulty: Difficulty
): Promise<RankResponse> {
  const response = await fetch(`${BASE_URL}/api/rank/${difficulty}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      // 랭킹이 없을 경우 빈 배열 반환
      return {
        success: false,
        difficulty,
        ranks: [],
        message: "해당 난이도의 랭킹 데이터가 존재하지 않습니다.",
      };
    }
    throw new Error(`랭킹 조회 실패: ${response.status}`);
  }

  return response.json();
}

