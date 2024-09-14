/*
 * @Author: Libra
 * @Date: 2024-09-13 14:25:55
 * @LastEditors: Libra
 * @Description:
 */
/*
 * @Author: Libra
 * @Date: 2024-09-13 14:25:55
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { getEnglishQuestion } from "@/data/english";

export async function getQuestion(id: number) {
  try {
    const question = await getEnglishQuestion(id);
    if (question) {
      return { code: 0, data: question, message: "success" };
    } else {
      return {
        data: null,
        code: code.SERVER_ERROR,
        message: "Failed to fetch question",
      };
    }
  } catch (error) {
    console.error("Error fetching question:", error);
    return {
      data: null,
      code: code.SERVER_ERROR,
      message: "An unexpected error occurred",
    };
  }
}
