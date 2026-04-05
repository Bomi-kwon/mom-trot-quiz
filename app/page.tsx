"use client";

import { useState, useCallback } from "react";
import { DailyQuiz } from "@/types/quiz";
import QuizStart from "@/components/QuizStart";
import QuizQuestion from "@/components/QuizQuestion";
import QuizResult from "@/components/QuizResult";

type GameState = "start" | "playing" | "result";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [quiz, setQuiz] = useState<DailyQuiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const startQuiz = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/today-quiz");
      if (!res.ok) throw new Error("Failed to fetch quiz");
      const data: DailyQuiz = await res.json();
      setQuiz(data);
      setCurrentQuestion(0);
      setScore(0);
      setGameState("playing");
    } catch (error) {
      console.error("Failed to load quiz:", error);
      alert("퀴즈를 불러오는데 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      if (isCorrect) {
        setScore((prev) => prev + 1);
      }

      if (quiz && currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setGameState("result");
      }
    },
    [quiz, currentQuestion]
  );

  const handleRestart = useCallback(() => {
    if (quiz) {
      setCurrentQuestion(0);
      setScore(0);
      setGameState("playing");
    }
  }, [quiz]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {gameState === "start" && (
        <QuizStart onStart={startQuiz} loading={loading} />
      )}

      {gameState === "playing" && quiz && (
        <QuizQuestion
          key={currentQuestion}
          question={quiz.questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={quiz.questions.length}
          onAnswer={handleAnswer}
        />
      )}

      {gameState === "result" && quiz && (
        <QuizResult
          score={score}
          total={quiz.questions.length}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
