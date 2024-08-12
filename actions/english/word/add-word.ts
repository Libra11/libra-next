/*
 * @Author: Libra
 * @Date: 2024-07-22 14:25:21
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { addWord } from "@/data/english";
import { Word, getWordsFromYouDao } from "@/lib/puppeteer-crawler";
import fs from "fs";

let infoCache: Word[] = [];

function appendDataToJson(filePath: string, info: Word, end: string) {
  infoCache.push(info);
  console.log(info.textContent);
  if (info.textContent === end) {
    // 将缓存中的数据写入文件
    fs.writeFile(filePath, JSON.stringify(infoCache), (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("write success");
      infoCache = []; // 清空缓存
    });
  }
}

export const addWordApi = async (word: string) => {
  try {
    const info = await getWordsFromYouDao(word);
    await new Promise((resolve) => setTimeout(resolve, 300));
    await addWord(info);
    // write info to ./test.json
    // appendDataToJson("./test.json", info, "versatility");

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
