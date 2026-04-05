import { NextResponse } from "next/server";
import { getTodayDateKST, getTodayQuiz, saveTodayQuiz } from "@/lib/kv";
import { generateDailyQuestions } from "@/lib/generate-quiz";

export async function GET() {
  try {
    // Try to get cached quiz first
    let quiz = await getTodayQuiz();

    if (quiz) {
      return NextResponse.json(quiz);
    }

    // Fallback: generate on the fly (mainly for local dev)
    const today = getTodayDateKST();
    const questions = await generateDailyQuestions(today);

    quiz = {
      date: today,
      questions,
    };

    await saveTodayQuiz(quiz);

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Failed to get today quiz:", error);
    return NextResponse.json(
      { error: "퀴즈를 불러오는데 실패했어요. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
