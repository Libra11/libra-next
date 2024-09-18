/*
 * @Author: Libra
 * @Date: 2024-09-14 14:35:08
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { getWords } from "@/data/english";

export const getWordsApi = async () => {
  try {
    const words = await getWords();
    return {
      code: 0,
      message: "Success",
      data: words,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Server error",
      data: null,
    };
  }
};
