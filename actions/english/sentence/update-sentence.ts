/*
 * @Author: Libra
 * @Date: 2024-09-14 10:31:14
 * @LastEditors: Libra
 * @Description:
 */
"use server";
import { code } from "@/common/code";
import { updateSentence } from "@/data/english";
import { Sentence } from "@prisma/client";

export const updateSentenceApi = async (
  id: number,
  data: Partial<Omit<Sentence, "id" | "createdAt" | "updatedAt">>
) => {
  try {
    const updatedSentence = await updateSentence(id, data);
    return {
      code: 0,
      data: updatedSentence,
      message: "Sentence updated successfully",
    };
  } catch (error) {
    return { code: code.SERVER_ERROR, message: "Failed to update sentence" };
  }
};
