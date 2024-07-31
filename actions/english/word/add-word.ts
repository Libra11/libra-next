/*
 * @Author: Libra
 * @Date: 2024-07-22 14:25:21
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { addWord } from "@/data/english";
import { getWordsFromYouDao } from "@/lib/puppeteer-crawler";
// import fs from "fs";

export const addWordApi = async (word: string) => {
  try {
    const info = await getWordsFromYouDao(word);
    await new Promise((resolve) => setTimeout(resolve, 300));
    await addWord(info);
    // write info to ./test.json
    // fs.readFile("./test.json", "utf-8", (err, data) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   let oldData = JSON.parse(data);
    //   oldData.push(info);
    //   fs.writeFile("./test.json", JSON.stringify(oldData), (err) => {
    //     if (err) {
    //       console.log(err);
    //       return;
    //     }
    //     console.log("write success");
    //   });
    // });

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
