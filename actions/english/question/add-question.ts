"use server";

import { addEnglishQuestion } from "@/data/english";
import { QuestionFormData } from "@/types/question";
import { code } from "@/common/code";

export async function addQuestionApi(data: QuestionFormData) {
  try {
    const question = await addEnglishQuestion(data);
    if (question) {
      return { code: 0, data: question, message: "success" };
    } else {
      return {
        data: null,
        code: code.SERVER_ERROR,
        message: "Failed to add question",
      };
    }
  } catch (error) {
    console.error("Error adding question:", error);
    return {
      data: null,
      code: code.SERVER_ERROR,
      message: "An unexpected error occurred",
    };
  }
}
