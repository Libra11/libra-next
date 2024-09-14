"use server";

import { deleteEnglishQuestion } from "@/data/english";
import { code } from "@/common/code";

export async function deleteQuestionApi(id: number) {
  try {
    const result = await deleteEnglishQuestion(id);
    if (result) {
      return { code: 0, message: "success", data: result };
    } else {
      return {
        data: null,
        code: code.SERVER_ERROR,
        message: "Failed to delete question",
      };
    }
  } catch (error) {
    console.error("Error deleting question:", error);
    return {
      data: null,
      code: code.SERVER_ERROR,
      message: "An unexpected error occurred",
    };
  }
}
