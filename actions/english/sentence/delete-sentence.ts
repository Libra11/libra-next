/*
 * @Author: Libra
 * @Date: 2024-09-14 10:31:14
 * @LastEditors: Libra
 * @Description:
 */
"use server";
import { code } from "@/common/code";
import { deleteSentence } from "@/data/english";

export const deleteSentenceApi = async (id: number) => {
  try {
    const result = await deleteSentence(id);
    return { code: 0, data: result, message: "Sentence deleted successfully" };
  } catch (error) {
    return { code: code.SERVER_ERROR, message: "Failed to delete sentence" };
  }
};
