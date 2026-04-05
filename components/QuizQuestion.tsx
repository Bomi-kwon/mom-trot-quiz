"use client";

import { useState } from "react";
import { QuizQuestion as QuizQuestionType } from "@/types/quiz";
import QuizAudioPlayer from "./QuizAudioPlayer";
import QuizFeedback from "./QuizFeedback";

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const isInitialConsonant = question.format === "initial_consonant";

  const handleSelect = (option: string) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
    setShowFeedback(true);
  };

  const handleTextSubmit = () => {
    if (showFeedback || !textInput.trim()) return;
    setSelectedAnswer(textInput.trim());
    setShowFeedback(true);
  };

  const isCorrect = isInitialConsonant
    ? selectedAnswer?.replace(/\s/g, "") === question.answer.replace(/\s/g, "")
    : selectedAnswer === question.answer;
  const isLast = questionNumber === totalQuestions;

  const getOptionStyle = (option: string) => {
    if (!showFeedback) {
      return "bg-white border-2 border-gray-200 hover:border-pink-400 hover:bg-pink-50 active:bg-pink-100";
    }
    if (option === question.answer) {
      return "bg-green-100 border-2 border-green-400 text-green-800";
    }
    if (option === selectedAnswer && option !== question.answer) {
      return "bg-red-100 border-2 border-red-400 text-red-800";
    }
    return "bg-gray-100 border-2 border-gray-200 opacity-50";
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-lg font-bold text-pink-600">
          {questionNumber} / {totalQuestions}
        </span>
        <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-pink-500 rounded-full transition-all duration-300"
            style={{
              width: `${(questionNumber / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question type badge */}
      <div className="mb-3">
        {question.format === "initial_consonant" && (
          <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full">
            초성 퀴즈
          </span>
        )}
        {question.format === "ox" && (
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
            O/X 퀴즈
          </span>
        )}
        {question.type === "song_listen" && (
          <span className="inline-block bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1 rounded-full">
            🎵 노래 듣기
          </span>
        )}
      </div>

      {/* Question text */}
      <h2 className="text-xl font-bold text-gray-800 mb-4 leading-relaxed">
        {question.question}
      </h2>

      {/* Initial consonant display */}
      {question.format === "initial_consonant" && question.initial_consonant && (
        <div className="text-3xl font-bold text-center text-purple-600 my-4 tracking-widest bg-purple-50 py-3 rounded-xl">
          {question.initial_consonant}
        </div>
      )}

      {/* Audio player */}
      {question.audio && (
        <QuizAudioPlayer
          youtubeId={question.audio.youtube_id}
          start={question.audio.start}
          end={question.audio.end}
        />
      )}

      {/* Answer input */}
      {isInitialConsonant ? (
        <div className="flex flex-col gap-3 mt-4">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
            disabled={showFeedback}
            placeholder="정답을 입력하세요"
            className="w-full text-lg font-medium py-4 px-5 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none disabled:bg-gray-100"
          />
          <button
            onClick={handleTextSubmit}
            disabled={showFeedback || !textInput.trim()}
            className="w-full bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white text-lg font-bold py-4 rounded-xl transition-all disabled:opacity-50"
          >
            확인
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mt-4">
          {(question.options || []).map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={showFeedback}
              className={`w-full text-left text-lg font-medium py-4 px-5 rounded-xl transition-all ${getOptionStyle(option)} disabled:cursor-default`}
            >
              {question.format === "ox" ? (
                <span className="text-2xl font-bold">{option}</span>
              ) : (
                <span>
                  <span className="text-pink-400 mr-2">
                    {["①", "②", "③", "④"][index]}
                  </span>
                  {option}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <QuizFeedback
          isCorrect={isCorrect}
          correctAnswer={question.answer}
          explanation={question.explanation}
          onNext={() => onAnswer(isCorrect)}
          isLast={isLast}
        />
      )}
    </div>
  );
}
