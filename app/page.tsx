"use client";

import { useState, useCallback } from "react";
import { QuizQuestion as QuizQuestionType } from "@/types/quiz";
import QuizStart from "@/components/QuizStart";
import QuizQuestion from "@/components/QuizQuestion";
import QuizResult from "@/components/QuizResult";
import allQuestions from "@/data/quiz-questions.json";

const QUIZ_COUNT = 10;

type RawQuestion = (typeof allQuestions)[number];

function getGroup(q: RawQuestion): string {
  if (q.type === "song_listen") return "audio";
  if (q.format === "initial_consonant" && q.type === "singer_guess")
    return "singer_initial";
  if (q.format === "initial_consonant" && q.type === "song_title")
    return "song_initial";
  if (q.format === "ox") return "ox";
  if (q.type === "singer_guess" && q.question.includes("힌트"))
    return "singer_hint";
  if (q.type === "singer_guess" && q.question.includes("부른 가수"))
    return "song_to_singer";
  if (
    q.type === "singer_guess" &&
    (q.question.includes("별명") || q.question.includes("해당하는"))
  )
    return "nickname";
  if (q.type === "episode_quiz" && q.format === "multiple_choice")
    return "program_quiz";
  if (q.type === "song_title") return "song_title";
  return "other";
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickRandomQuestions(count: number): QuizQuestionType[] {
  // 그룹별로 문제 분류
  const grouped: Record<string, RawQuestion[]> = {};
  for (const q of allQuestions) {
    const group = getGroup(q);
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(q);
  }

  // 각 그룹 내부를 셔플
  const groupKeys = shuffle(Object.keys(grouped));
  for (const key of groupKeys) {
    grouped[key] = shuffle(grouped[key]);
  }

  // 라운드 로빈으로 각 그룹에서 1개씩 뽑기
  const picked: RawQuestion[] = [];
  let round = 0;
  while (picked.length < count) {
    for (const key of groupKeys) {
      if (picked.length >= count) break;
      if (round < grouped[key].length) {
        picked.push(grouped[key][round]);
      }
    }
    round++;
  }

  return shuffle(picked) as QuizQuestionType[];
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
