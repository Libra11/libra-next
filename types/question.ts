import { QuestionType, EnglishQuestion } from "@prisma/client";

export type QuestionFormData = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  type: QuestionType;
};

export type { EnglishQuestion };
