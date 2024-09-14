/*
 * @Author: Libra
 * @Date: 2024-09-13 14:25:56
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { updateEnglishQuestion } from "@/data/english";
import { QuestionFormData } from "@/types/question";
import { code } from "@/common/code";

export async function updateQuestionApi(
  id: number,
  data: Partial<QuestionFormData>
) {
  try {
    const updatedQuestion = await updateEnglishQuestion(id, data);
    if (updatedQuestion) {
      return {
        code: 0,
        data: updatedQuestion,
        message: "Question updated successfully",
      };
    } else {
      return {
        code: code.SERVER_ERROR,
        data: null,
        message: "Failed to update question",
      };
    }
  } catch (error) {
    console.error("Error updating question:", error);
    return {
      code: code.SERVER_ERROR,
      data: null,
      message: "An unexpected error occurred",
    };
  }
}
