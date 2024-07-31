/*
 * @Author: Libra
 * @Date: 2024-07-31 14:46:25
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { addWords } from "@/data/english";
import { Word } from "@/lib/puppeteer-crawler";

export const addWordByFileApi = async (words: Word[]) => {
  try {
    await addWords(words);
    return {
      code: 0,
      message: "Add word success",
      data: null,
    };
  } catch (error) {
    console.log(error);
    return {
      code: code.SERVER_ERROR,
      message: "Add word failed",
      data: null,
    };
  }
};
