/*
 * @Author: Libra
 * @Date: 2024-09-14 10:31:11
 * @LastEditors: Libra
 * @Description:
 */
"use server";
import { code } from "@/common/code";
import { getSentences } from "@/data/english";

export const getSentencesApi = async () => {
  try {
    const sentences = await getSentences();
    return {
      code: 0,
      data: sentences,
      message: "Sentences fetched successfully",
    };
  } catch (error) {
    return { code: code.SERVER_ERROR, message: "Failed to fetch sentences" };
  }
};
