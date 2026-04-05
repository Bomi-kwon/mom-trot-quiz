"use client";

import { useState } from "react";
import { QuizGrade } from "@/types/quiz";

interface QuizResultProps {
  score: number;
  total: number;
  onRestart: () => void;
}

function getGrade(score: number): QuizGrade {
  switch (score) {
    case 5:
      return { title: "트로트 대통령", emoji: "🏆" };
    case 4:
      return { title: "트로트 장관", emoji: "🎤" };
    case 3:
      return { title: "트로트 팬", emoji: "🎵" };
    case 2:
      return { title: "트로트 새싹", emoji: "🌱" };
    default:
      return { title: "트로트 입문자", emoji: "😅" };
  }
}

export default function QuizResult({
  score,
  total,
  onRestart,
}: QuizResultProps) {
  const [copied, setCopied] = useState(false);
  const grade = getGrade(score);

  const shareText = `🎤 트로트 퀴즈왕 결과 🎤
오늘의 점수: ${score}/${total}
나의 등급: ${grade.title} ${grade.emoji}
나도 도전해보기 → ${typeof window !== "undefined" ? window.location.origin : ""}`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      {/* Grade emoji */}
      <div className="text-8xl mb-4 animate-bounce">{grade.emoji}</div>

      {/* Grade title */}
      <h2 className="text-3xl font-bold text-pink-600 mb-2">{grade.title}</h2>

      {/* Score */}
      <p className="text-xl text-gray-700 mb-8">
        {total}문제 중{" "}
        <span className="text-pink-600 font-bold">{score}개</span> 정답!
      </p>

      {/* Score stars */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`text-3xl ${i < score ? "opacity-100" : "opacity-30"}`}
          >
            ⭐
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={handleShare}
          className="bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-gray-800 text-lg font-bold py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
        >
          {copied ? "✅ 복사 완료!" : "📋 결과 공유하기"}
        </button>
        <button
          onClick={onRestart}
          className="bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white text-lg font-bold py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
        >
          🔄 다시 하기
        </button>
      </div>
    </div>
  );
}
