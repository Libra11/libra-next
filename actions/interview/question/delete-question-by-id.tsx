/**
 * Author: Libra
 * Date: 2024-08-09 14:08:19
 * LastEditors: Libra
 * Description:
 */
"use server";
import { code } from "@/common/code";
import { deleteQuestionById } from "@/data/interview";

export const deleteQuestionByIdApi = async (id: number) => {
  try {
    const question = await deleteQuestionById(id);
    return {
      code: 0,
      message: "Delete question success",
      data: question,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Delete question failed",
      data: error,
    };
  }
};
