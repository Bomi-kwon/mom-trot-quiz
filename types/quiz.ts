export interface Singer {
  name: string;
  image: string;
  program: string;
  rank: string;
  songs: string[];
  facts: string[];
}

export interface AudioQuiz {
  youtube_id: string;
  start: number;
  end: number;
  answer_type: "song_title" | "singer";
  answer: string;
  singer: string;
  options: string[];
}

export interface QuizData {
  singers: Singer[];
  audio_quizzes: AudioQuiz[];
}

export type QuestionType =
  | "singer_guess"
  | "song_title"
  | "song_listen"
  | "episode_quiz";

export type QuestionFormat = "multiple_choice" | "initial_consonant" | "ox";

export interface QuizQuestion {
  type: QuestionType;
  format: QuestionFormat;
  question: string;
  image?: string;
  audio?: {
    youtube_id: string;
    start: number;
    end: number;
  };
  initial_consonant?: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface DailyQuiz {
  date: string;
  questions: QuizQuestion[];
}

export interface QuizGrade {
  title: string;
  emoji: string;
}
