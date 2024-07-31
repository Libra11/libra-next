/*
 * @Author: Libra
 * @Date: 2024-07-22 14:18:30
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { getWord } from "@/data/english";

export const getWordApi = async (textContent: string) => {
  try {
    const word = await getWord(textContent);
    if (!word) {
      return {
        code: code.WORD_NOT_FOUND,
        message: "Word not found",
        data: null,
      };
    }
    return {
      code: 0,
      message: "Get word success",
      data: word,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Get word failed",
      data: error,
    };
  }
};
