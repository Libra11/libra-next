/**
 * Author: Libra
 * Date: 2024-08-08 16:15:19
 * LastEditors: Libra
 * Description:
 */
"use server";
import { code } from "@/common/code";
import { getInterviewQuestionsByCategory } from "@/data/interview";
export const getQuestionsByCategoryApi = async (id: number) => {
  try {
    const questions = await getInterviewQuestionsByCategory(id);
    return {
      code: 0,
      message: "Get questions success",
      data: questions,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Get questions failed",
      data: error,
    };
  }
};
