"use client";

import { useState, useCallback } from "react";
import { QuizQuestion as QuizQuestionType } from "@/types/quiz";
import QuizStart from "@/components/QuizStart";
import QuizQuestion from "@/components/QuizQuestion";
import QuizResult from "@/components/QuizResult";
import allQuestions from "@/data/quiz-questions.json";

const QUIZ_COUNT = 10;

function pickRandomQuestions(count: number): QuizQuestionType[] {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count) as QuizQuestionType[];
}

type GameState = "start" | "playing" | "result";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const startQuiz = useCallback(() => {
    setQuestions(pickRandomQuestions(QUIZ_COUNT));
    setCurrentQuestion(0);
    setScore(0);
    setGameState("playing");
  }, []);

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      if (isCorrect) {
        setScore((prev) => prev + 1);
      }

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setGameState("result");
      }
    },
    [questions, currentQuestion]
  );

  const handleRestart = useCallback(() => {
    setQuestions(pickRandomQuestions(QUIZ_COUNT));
    setCurrentQuestion(0);
    setScore(0);
    setGameState("playing");
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {gameState === "start" && (
        <QuizStart onStart={startQuiz} loading={false} />
      )}

      {gameState === "playing" && questions.length > 0 && (
        <QuizQuestion
          key={currentQuestion}
          question={questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
        />
      )}

      {gameState === "result" && (
        <QuizResult
          score={score}
          total={questions.length}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
