# 🧾 API 명세서

**프로젝트명:** Catch the Mosquito!
**Base URL:** `https://port-0-gdgoc-back-mhg0mhul3fb7a201.sel3.cloudtype.app/`

---

## 1️⃣ 점수 및 기록 저장 API

### **[POST] /api/score/submit**

### 📘 설명

유저가 게임을 완료했을 때 점수, 걸린 시간, 난이도 정보를 서버에 전송하고
서버 메모리에 기록된 랭킹에 반영합니다.

### 📥 Request

**URL:**
`POST https://port-0-gdgoc-back-mhg0mhul3fb7a201.sel3.cloudtype.app/api/score/submit`

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "name": "홍길동",
  "difficulty": "medium",
  "score": 45,
  "time": 58.4
}
```

| 필드명       | 타입   | 필수 | 설명                            |
| :----------- | :----- | :--- | :------------------------------ |
| `name`       | string | ✅   | 유저 이름                       |
| `difficulty` | string | ✅   | 난이도 (easy / medium / hard)   |
| `score`      | number | ✅   | 게임에서 획득한 점수            |
| `time`       | number | ✅   | 모기를 잡는 데 걸린 총 시간(초) |

### 📤 Response

**성공 (200 OK):**

```json
{
  "success": true,
  "message": "점수가 성공적으로 기록되었습니다.",
  "user": {
    "name": "홍길동",
    "difficulty": "medium",
    "score": 45,
    "time": 58.4
  },
  "rank": 3
}
```

**에러 (400 Bad Request):**

```json
{
  "success": false,
  "message": "필수 입력값이 누락되었습니다."
}
```

### 🧠 내부 로직 요약

- 서버 메모리에 `ranking[difficulty]` 배열을 유지
- 새 기록 추가 후 점수 기준 내림차순 정렬
  - 점수가 같을 경우 시간(`time`)이 더 짧은 순

- 랭킹은 최대 5개까지만 유지 (6번째부터는 제거)
- 현재 유저의 랭크를 계산하여 응답

---

## 2️⃣ 랭킹 조회 API

### **[GET] /api/rank/:difficulty**

### 📘 설명

요청한 난이도에 대한 현재 상위 5명의 랭킹을 반환합니다.

### 📥 Request

**URL 예시:**

```
GET https://port-0-gdgoc-back-mhg0mhul3fb7a201.sel3.cloudtype.app/api/rank/easy
```

**Path Parameter:**

| 파라미터     | 타입   | 필수 | 설명                         |
| :----------- | :----- | :--- | :--------------------------- |
| `difficulty` | string | ✅   | easy / medium / hard 중 하나 |

### 📤 Response

**성공 (200 OK):**

```json
{
  "success": true,
  "difficulty": "easy",
  "ranks": [
    { "rank": 1, "name": "홍길동", "score": 55, "time": 57.2 },
    { "rank": 2, "name": "이순신", "score": 48, "time": 59.1 },
    { "rank": 3, "name": "김유신", "score": 42, "time": 60.0 },
    { "rank": 4, "name": "박지성", "score": 39, "time": 59.8 },
    { "rank": 5, "name": "최영", "score": 35, "time": 58.7 }
  ]
}
```

**에러 (404 Not Found):**

```json
{
  "success": false,
  "message": "해당 난이도의 랭킹 데이터가 존재하지 않습니다."
}
```

### 🧠 내부 로직 요약

- 서버 메모리 내 `ranking[difficulty]` 배열 참조
- 점수 기준 내림차순, 동점 시 짧은 시간 순 정렬
- 최대 5명까지만 반환

---

## 3️⃣ 데이터 구조 (서버 메모리 내)

```ts
interface RankEntry {
  name: string;
  score: number;
  time: number;
}

interface RankingData {
  easy: RankEntry[];
  medium: RankEntry[];
  hard: RankEntry[];
}
```

---

## 4️⃣ 예시 플로우

1. 사용자가 게임을 완료하면
   → `/api/score/submit` 으로 `POST` 요청
2. 서버에서 랭킹 갱신 후 현재 순위 반환
3. 클라이언트는 `/api/rank/:difficulty` 호출로 실시간 랭킹 표시

---

## 5️⃣ 상태 코드 요약

| 상태 코드 | 의미                  | 설명                    |
| :-------- | :-------------------- | :---------------------- |
| 200       | OK                    | 요청 성공               |
| 400       | Bad Request           | 잘못된 입력값           |
| 404       | Not Found             | 해당 난이도 데이터 없음 |
| 500       | Internal Server Error | 서버 내부 오류          |

---
