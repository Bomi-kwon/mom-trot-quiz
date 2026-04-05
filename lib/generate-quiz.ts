import { GoogleGenerativeAI } from "@google/generative-ai";
import { QuizQuestion } from "@/types/quiz";
import quizData from "@/data/quiz-data.json";

export async function generateDailyQuestions(
  date: string
): Promise<QuizQuestion[]> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `당신은 트로트 퀴즈 출제자입니다.
아래 제공된 데이터에서만 문제를 출제하세요. 데이터에 없는 정보를 절대 만들어내지 마세요.

[규칙]
- 총 5문제를 출제합니다
- 문제 유형을 섞어서 출제: 가수 맞추기, 노래 제목 맞추기, 방송 퀴즈 중 랜덤
- 문제 형식을 섞어서 출제: 4지선다, 초성 퀴즈, O/X 중 랜덤
- 오디오 퀴즈(audio_quizzes)가 데이터에 있으면 1문제 포함
- 각 문제에 간단한 해설을 포함합니다
- 4지선다의 오답 보기도 반드시 데이터에 존재하는 가수/곡에서 선택합니다
- 초성 퀴즈의 경우 initial_consonant 필드에 정답의 초성을 넣어주세요
- O/X 퀴즈의 경우 options는 ["O", "X"]로, answer는 "O" 또는 "X"로 설정하세요
- 난이도는 쉽게 (팬이라면 맞출 수 있는 수준)
- 어제와 같은 문제가 나오지 않도록 다양하게 조합합니다
- image 필드는 가수 맞추기 문제에서 해당 가수의 image 경로를 넣어주세요 (힌트로 사진을 보여주지는 않고, 정답 확인 시 사용)

[오늘 날짜]
${date}

[데이터]
${JSON.stringify(quizData, null, 2)}

[응답 형식 - 반드시 아래 JSON 형식으로만 응답하고, 다른 텍스트는 포함하지 마세요]
{
  "questions": [
    {
      "type": "singer_guess | song_title | song_listen | episode_quiz",
      "format": "multiple_choice | initial_consonant | ox",
      "question": "문제 텍스트",
      "image": "가수 이미지 경로 (필요한 경우, 없으면 이 필드 생략)",
      "audio": {
        "youtube_id": "유튜브 ID",
        "start": 시작초,
        "end": 끝초
      },
      "initial_consonant": "ㅇㅇㅇ (초성 퀴즈인 경우만, 아니면 생략)",
      "options": ["보기1", "보기2", "보기3", "보기4"],
      "answer": "정답",
      "explanation": "해설"
    }
  ]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Parse JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse quiz response from Gemini");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return parsed.questions as QuizQuestion[];
}
