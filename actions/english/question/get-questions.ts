"use server";

import { getEnglishQuestions } from "@/data/english";
import { code } from "@/common/code";

export async function getQuestionsApi() {
  try {
    const questions = await getEnglishQuestions();
    if (questions) {
      return { code: 0, data: questions, message: "success" };
    } else {
      return {
        data: null,
        code: code.SERVER_ERROR,
        message: "Failed to fetch questions",
      };
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    return {
      data: null,
      code: code.SERVER_ERROR,
      message: "An unexpected error occurred",
    };
  }
}
