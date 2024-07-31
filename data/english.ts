/*
 * @Author: Libra
 * @Date: 2024-07-22 14:19:36
 * @LastEditors: Libra
 * @Description:
 */
import { db } from "@/lib/db";
import { Word } from "@/lib/puppeteer-crawler";

export const addWord = async (word: Word) => {
  try {
    const existingWord = await db.word.findUnique({
      where: { textContent: word.textContent },
    });

    if (existingWord) return null;
    const res = await db.word.create({
      data: {
        textContent: word.textContent,
        phoneticsArray: {
          create: word.phoneticsArray,
        },
        translationsArray: {
          create: word.translationsArray,
        },
      },
    });
    console.log("success", res);
    return res;
  } catch (error) {
    return null;
  }
};

export const getWord = async (textContent: string) => {
  try {
    const word = await db.word.findFirst({
      where: { textContent },
      include: {
        phoneticsArray: true,
        translationsArray: true,
      },
    });
    if (!word) return null;
    return word;
  } catch (error) {
    return null;
  }
};

export const addWords = async (words: Word[]) => {
  try {
    const res = await db.word.createMany({
      data: words.map((word) => ({
        textContent: word.textContent,
        phoneticsArray: {
          create: word.phoneticsArray,
        },
        translationsArray: {
          create: word.translationsArray,
        },
      })),
    });
    console.log("success", res);
    return res;
  } catch (error) {
    return null;
  }
};
