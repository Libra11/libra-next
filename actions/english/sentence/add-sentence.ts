/*
 * @Author: Libra
 * @Date: 2024-09-14 10:31:11
 * @LastEditors: Libra
 * @Description:
 */
"use server";
import { code } from "@/common/code";
import { addSentence } from "@/data/english";
import { Sentence } from "@prisma/client";

export const addSentenceApi = async (
  data: Omit<Sentence, "id" | "createdAt" | "updatedAt">
) => {
  try {
    const sentence = await addSentence(data);
    return { code: 0, data: sentence, message: "Sentence added successfully" };
  } catch (error) {
    return { code: code.SERVER_ERROR, message: "Failed to add sentence" };
  }
};
