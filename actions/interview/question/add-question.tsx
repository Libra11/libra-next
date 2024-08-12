/**
 * Author: Libra
 * Date: 2024-08-08 15:17:16
 * LastEditors: Libra
 * Description:
 */
"use server";

import { code } from "@/common/code";
import * as z from "zod";
import { InterviewQuestionSchema } from "@/schemas";
import { addInterviewQuestion } from "@/data/interview";

export const addQuestionApi = async (
  values: z.infer<typeof InterviewQuestionSchema>
) => {
  const validateFields = InterviewQuestionSchema.safeParse(values);
  if (!validateFields.success) {
    return {
      code: code.INVALID_INPUT,
      message: validateFields.error.errors,
      data: null,
    };
  }
  try {
    const {
      category,
      questionText,
      answerContent,
      tags,
      difficulty,
      isActive,
    } = values;
    const question = await addInterviewQuestion({
      category,
      questionText,
      answerContent,
      tags,
      difficulty,
      isActive,
    });
    return {
      code: 0,
      message: "Add question success",
      data: question,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Add question failed",
      data: error,
    };
  }
};
