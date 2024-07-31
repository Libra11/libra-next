/*
 * @Author: Libra
 * @Date: 2024-07-22 14:34:58
 * @LastEditors: Libra
 * @Description:
 */
import puppeteer, { Browser, Page } from "puppeteer-core";
import { executablePath } from "puppeteer";

export type Word = {
  textContent: string;
  phoneticsArray: Phonetic[];
  translationsArray: Translation[];
};

type Phonetic = {
  name: string;
  value: string;
  phonetic: string;
};

type Translation = {
  pos: string;
  trans: string;
};

// 获取页面的词信息
async function getWordInfo(page: Page): Promise<Word> {
  return page.evaluate(() => {
    const titleElement = document.querySelector(".word-head .title");
    const textContent = titleElement?.childNodes[0].nodeValue?.trim() || "";

    const phoneticElements = document.querySelectorAll(".per-phone");
    const phoneticsArray: Phonetic[] = [];
    phoneticElements.forEach((element) => {
      const name = element.querySelector("span")?.innerText || null;
      const value = element.querySelector(".phonetic")?.textContent || null;
      if (!name || !value) return;
      phoneticsArray.push({
        name,
        value,
        phonetic:
          name === "美"
            ? `word/${textContent}_us.mp3`
            : `word/${textContent}_en.mp3`,
      });
    });

    const translationElements = document.querySelectorAll(".basic .word-exp");
    const translationsArray: Translation[] = [];
    translationElements.forEach((element) => {
      const pos = element.querySelector(".pos")?.textContent || "";
      const trans = element.querySelector(".trans")?.textContent || "";
      translationsArray.push({ pos, trans });
    });

    return {
      textContent,
      phoneticsArray,
      translationsArray,
    };
  });
}

// 处理单个单词
async function processWord(browser: Browser, word: string): Promise<Word> {
  const page = await browser.newPage();
  const url = `https://www.youdao.com/result?word=${word}&lang=en`;
  await page.goto(url);
  const wordInfo = await getWordInfo(page);
  await page.close();
  return wordInfo;
}

// 获取多个单词的词信息
export async function getWordsFromYouDao(word: string) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath:
      process.env.NODE_ENV === "development"
        ? executablePath()
        : "/usr/bin/chromium-browser",
  });
  const wordInfo = await processWord(browser, word);
  await browser.close();
  return wordInfo;
}
