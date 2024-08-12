/**
 * Author: Libra
 * Date: 2024-08-09 09:47:44
 * LastEditors: Libra
 * Description:
 */
"use server";
import { code } from "@/common/code";
import { getQuestionById } from "@/data/interview";

export const getQuestionByIdApi = async (id: number) => {
  try {
    const question = await getQuestionById(id);
    return {
      code: 0,
      message: "Get question success",
      data: question,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Get question failed",
      data: error,
    };
  }
};
