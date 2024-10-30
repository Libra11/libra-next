/*
 * @Author: Libra
 * @Date: 2024-10-28 14:58:30
 * @LastEditors: Libra
 * @Description:
 */
"use server";
import { code } from "@/common/code";
import { updateAlgorithm } from "@/data/algorithm";
import { AlgorithmSchema } from "@/schemas";
import * as z from "zod";

export const updateAlgorithmApi = async (
  id: number,
  values: z.infer<typeof AlgorithmSchema>
) => {
  const validateFields = AlgorithmSchema.safeParse(values);
  if (!validateFields.success) {
    return {
      code: code.INVALID_INPUT,
      message: validateFields.error.errors,
      data: null,
    };
  }
  try {
    const { name, description, difficulty, approach, solution, tags } = values;
    const algorithm = await updateAlgorithm(id, {
      name,
      description,
      difficulty,
      approach,
      solution,
      tags,
    });
    return {
      code: 0,
      message: "Update algorithm success",
      data: algorithm,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "更新失败",
      data: null,
    };
  }
};
