import { NextResponse } from "next/server";
import { getTodayDateKST, saveTodayQuiz } from "@/lib/kv";
import { generateDailyQuestions } from "@/lib/generate-quiz";

export async function GET(request: Request) {
  // Verify cron secret (skip in development)
  if (process.env.NODE_ENV === "production") {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  try {
    const today = getTodayDateKST();
    const questions = await generateDailyQuestions(today);

    const dailyQuiz = {
      date: today,
      questions,
    };

    await saveTodayQuiz(dailyQuiz);

    return NextResponse.json({
      success: true,
      date: today,
      questionCount: questions.length,
    });
  } catch (error) {
    console.error("Failed to generate daily quiz:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
