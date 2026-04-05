"use client";

interface QuizFeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  onNext: () => void;
  isLast: boolean;
}

export default function QuizFeedback({
  isCorrect,
  correctAnswer,
  explanation,
  onNext,
  isLast,
}: QuizFeedbackProps) {
  return (
    <div
      className={`mt-4 p-5 rounded-2xl ${
        isCorrect
          ? "bg-green-50 border-2 border-green-300"
          : "bg-red-50 border-2 border-red-300"
      }`}
    >
      <div className="text-2xl font-bold mb-2">
        {isCorrect ? (
          <span className="text-green-600">🎉 정답!</span>
        ) : (
          <span className="text-red-600">😢 아쉬워요!</span>
        )}
      </div>
      {!isCorrect && (
        <p className="text-lg font-semibold text-gray-700 mb-2">
          정답: <span className="text-green-600">{correctAnswer}</span>
        </p>
      )}
      <p className="text-base text-gray-600 leading-relaxed">{explanation}</p>
      <button
        onClick={onNext}
        className="mt-4 w-full bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white text-lg font-bold py-3 rounded-xl transition-all"
      >
        {isLast ? "결과 보기" : "다음 문제"}
      </button>
    </div>
  );
}
