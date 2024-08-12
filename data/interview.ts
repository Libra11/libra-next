/*
 * @Author: Libra
 * @Date: 2024-08-08 10:31:52
 * @LastEditors: Libra
 * @Description:
 */
import { IInterviewQuestion } from "@/app/main/interview/page";
import { db } from "@/lib/db";

export const addTag = async (name: string) => {
  try {
    const existingTag = await db.tag.findFirst({
      where: {
        name,
      },
    });
    if (existingTag) return "Tag already exists";
    const tag = await db.tag.create({
      data: {
        name,
      },
    });
    return tag;
  } catch (error) {
    return error;
  }
};

export const getTags = async () => {
  try {
    const tags = await db.tag.findMany();
    return tags;
  } catch (error) {
    return error;
  }
};

export const deleteTag = async (id: number) => {
  try {
    const tag = await db.tag.delete({
      where: {
        id,
      },
    });
    return tag;
  } catch (error) {
    return error;
  }
};

export const addCategory = async (name: string) => {
  try {
    const existingCategory = await db.category.findFirst({
      where: {
        name,
      },
    });
    if (existingCategory) return "Category already exists";
    const category = await db.category.create({
      data: {
        name,
      },
    });
    return category;
  } catch (error) {
    return error;
  }
};

export const getCategories = async () => {
  try {
    const categories = await db.category.findMany();
    return categories;
  } catch (error) {
    return error;
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const category = await db.category.delete({
      where: {
        id,
      },
    });
    return category;
  } catch (error) {
    return error;
  }
};

export const addInterviewQuestion = async (question: IInterviewQuestion) => {
  try {
    const res = await db.interviewQuestion.create({
      data: {
        questionText: question.questionText,
        answerContent: question.answerContent,
        difficulty: question.difficulty,
        category: {
          connect: { id: Number(question.category) },
        },
        tags: {
          create: (question.tags || []).map((tag) => ({
            tag: {
              connect: { id: Number(tag) },
            },
          })),
        },
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const getInterviewQuestionsByCategory = async (categoryId: number) => {
  try {
    const questions = await db.interviewQuestion.findMany({
      where: {
        categoryId,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return questions;
  } catch (error) {
    return error;
  }
};

export const getInterviewQuestionsByCategoryAndTag = async (
  categoryId: number,
  tagId: number
) => {
  try {
    const questions = await db.interviewQuestion.findMany({
      where: {
        category: {
          id: categoryId,
        },
        tags: {
          some: {
            tag: {
              id: tagId,
            },
          },
        },
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return questions;
  } catch (error) {
    return error;
  }
};

export const getQuestionById = async (id: number) => {
  try {
    const question = await db.interviewQuestion.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return question;
  } catch (error) {
    return error;
  }
};

export const updateQuestionById = async (
  id: number,
  question: IInterviewQuestion
) => {
  try {
    const res = await db.interviewQuestion.update({
      where: {
        id,
      },
      data: {
        questionText: question.questionText,
        answerContent: question.answerContent,
        difficulty: question.difficulty,
        category: {
          connect: { id: Number(question.category) },
        },
        tags: {
          deleteMany: {},
          create: (question.tags || []).map((tag) => ({
            tag: {
              connect: { id: Number(tag) },
            },
          })),
        },
      },
    });
    return res;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

export const deleteQuestionById = async (id: number) => {
  try {
    const question = await db.interviewQuestion.delete({
      where: {
        id,
      },
    });
    return question;
  } catch (error) {
    console.log(error);
    return error;
  }
};
