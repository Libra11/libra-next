/*
 * @Author: Libra
 * @Date: 2024-07-22 14:19:36
 * @LastEditors: Libra
 * @Description:
 */
import { ParagraphData } from "@/actions/english/paragraph/update-paragraph";
import { ParagraphFormData } from "@/app/main/english/paragraph/components/add-paragraph-dialog";
import { db } from "@/lib/db";
import { Word } from "@/lib/puppeteer-crawler";
import { Paragraph } from "@prisma/client";
import { EnglishQuestion, QuestionType } from "@prisma/client";
import { QuestionFormData } from "@/types/question";
import { Sentence, Difficulty } from "@prisma/client";

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
      where: {
        textContent: {
          equals: textContent,
          mode: "insensitive", // 这里添加不区分大小写的查询
        },
      },
      include: {
        phoneticsArray: true,
        translationsArray: true,
      },
    });
    if (!word) return null;
    return word;
  } catch (error) {
    console.error("Error fetching word:", error);
    return null;
  }
};

export const getWords = async () => {
  try {
    const words = await db.word.findMany();
    return words;
  } catch (error) {
    console.error("Error fetching words:", error);
    return null;
  }
};

export const addWords = async (words: Word[]) => {
  try {
    const res = await Promise.all(
      words.map(async (word) => {
        // 检查是否已经存在相同的 textContent
        const existingWord = await db.word.findUnique({
          where: {
            textContent: word.textContent,
          },
        });

        if (existingWord) {
          // 如果已经存在，则跳过插入
          return existingWord;
        } else {
          // 如果不存在，则进行插入
          return await db.word.create({
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
        }
      })
    );
    return res;
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

export const addParagraph = async (paragraph: ParagraphFormData) => {
  try {
    const res = await db.paragraph.create({
      data: paragraph,
    });
    return res;
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

export const deleteParagraph = async (id: number) => {
  try {
    await db.paragraph.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const getParagraphs = async () => {
  try {
    const paragraphs = await db.paragraph.findMany();
    return paragraphs;
  } catch (error) {
    return null;
  }
};

export const getParagraph = async (id: number) => {
  try {
    const paragraph = await db.paragraph.findUnique({
      where: { id },
    });
    return paragraph;
  } catch (error) {
    return null;
  }
};

export const updateParagraph = async (data: ParagraphData) => {
  console.log("Updating paragraph in database:", data);
  try {
    const updatedParagraph = await db.paragraph.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        translation: data.translation,
        note: data.note,
        srt_lyrics: data.srt_lyrics,
        audio_url: data.audio_url,
        updated_at: new Date(),
      },
    });
    console.log("Updated paragraph:", updatedParagraph);
    return updatedParagraph;
  } catch (error) {
    console.error("更新段落时出错:", error);
    return null;
  }
};

export const addEnglishQuestion = async (data: QuestionFormData) => {
  try {
    const question = await db.englishQuestion.create({
      data,
    });
    return question;
  } catch (error) {
    console.error("Error adding question:", error);
    return null;
  }
};

export const getEnglishQuestions = async () => {
  try {
    const questions = await db.englishQuestion.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return null;
  }
};

export const getEnglishQuestion = async (id: number) => {
  try {
    const question = await db.englishQuestion.findUnique({
      where: { id },
    });
    return question;
  } catch (error) {
    console.error("Error fetching question:", error);
    return null;
  }
};

export const updateEnglishQuestion = async (
  id: number,
  data: Partial<QuestionFormData>
) => {
  try {
    const updatedQuestion = await db.englishQuestion.update({
      where: { id },
      data,
    });
    return updatedQuestion;
  } catch (error) {
    console.error("Error updating question:", error);
    return null;
  }
};

export const deleteEnglishQuestion = async (id: number) => {
  try {
    await db.englishQuestion.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error("Error deleting question:", error);
    return false;
  }
};

export const addSentence = async (
  data: Omit<Sentence, "id" | "createdAt" | "updatedAt">
) => {
  try {
    const sentence = await db.sentence.create({
      data,
    });
    return sentence;
  } catch (error) {
    console.error("Error adding sentence:", error);
    return null;
  }
};

// getSentences 和 getSentence 函数不需要修改

export const updateSentence = async (
  id: number,
  data: Partial<Omit<Sentence, "id" | "createdAt" | "updatedAt">>
) => {
  try {
    const updatedSentence = await db.sentence.update({
      where: { id },
      data,
    });
    return updatedSentence;
  } catch (error) {
    console.error("Error updating sentence:", error);
    return null;
  }
};

// deleteSentence 函数不需要修改

export const getSentences = async () => {
  try {
    const sentences = await db.sentence.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return sentences;
  } catch (error) {
    console.error("Error fetching sentences:", error);
    return null;
  }
};

export const getSentence = async (id: number) => {
  try {
    const sentence = await db.sentence.findUnique({
      where: { id },
    });
    return sentence;
  } catch (error) {
    console.error("Error fetching sentence:", error);
    return null;
  }
};

export const deleteSentence = async (id: number) => {
  try {
    await db.sentence.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error("Error deleting sentence:", error);
    return false;
  }
};
