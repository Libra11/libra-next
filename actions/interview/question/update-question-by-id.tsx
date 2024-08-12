/**
 * Author: Libra
 * Date: 2024-08-09 10:46:22
 * LastEditors: Libra
 * Description:
 */
"use server";
import { updateQuestionById } from "@/data/interview";
import { InterviewQuestionSchema } from "@/schemas";
import { code } from "@/common/code";
import * as z from "zod";

export const updateQuestionByIdApi = async (
  id: number,
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
    console.log("values", values);
    const question = await updateQuestionById(id, {
      category,
      questionText,
      answerContent,
      tags,
      difficulty,
      isActive,
    });
    return {
      code: 0,
      message: "Update question success",
      data: question,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Update question failed",
      data: error,
    };
  }
};
