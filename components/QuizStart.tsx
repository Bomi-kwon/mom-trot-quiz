"use client";

interface QuizStartProps {
  onStart: () => void;
  loading: boolean;
}

export default function QuizStart({ onStart, loading }: QuizStartProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="text-6xl mb-4">🎤</div>
      <h1 className="text-4xl font-bold text-pink-600 mb-3">트로트 퀴즈왕</h1>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        트로트 퀴즈 10문제에
        <br />
        도전하세요!
      </p>
      <button
        onClick={onStart}
        disabled={loading}
        className="bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white text-xl font-bold py-4 px-12 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            퀴즈 준비 중...
          </span>
        ) : (
          "퀴즈 시작"
        )}
      </button>
    </div>
  );
}
