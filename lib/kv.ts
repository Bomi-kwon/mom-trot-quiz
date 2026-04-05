import { DailyQuiz } from "@/types/quiz";

function getTodayDateKST(): string {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kst = new Date(now.getTime() + kstOffset);
  return kst.toISOString().split("T")[0];
}

// Use Vercel KV in production, fallback to in-memory for local dev
let memoryStore: Record<string, string> = {};

async function getKV() {
  try {
    const { kv } = await import("@vercel/kv");
    // Test if KV is configured by checking env vars
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      return kv;
    }
  } catch {
    // KV not available
  }
  return null;
}

export async function getTodayQuiz(): Promise<DailyQuiz | null> {
  const today = getTodayDateKST();
  const key = `quiz:${today}`;

  const kv = await getKV();
  if (kv) {
    const data = await kv.get<DailyQuiz>(key);
    return data;
  }

  // Fallback: in-memory store for local dev
  const stored = memoryStore[key];
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
}

export async function saveTodayQuiz(quiz: DailyQuiz): Promise<void> {
  const key = `quiz:${quiz.date}`;
  // Expire after 48 hours
  const ttl = 48 * 60 * 60;

  const kv = await getKV();
  if (kv) {
    await kv.set(key, quiz, { ex: ttl });
    return;
  }

  // Fallback: in-memory store for local dev
  memoryStore[key] = JSON.stringify(quiz);
}

export { getTodayDateKST };
