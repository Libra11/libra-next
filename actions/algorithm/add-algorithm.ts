/*
 * @Author: Libra
 * @Date: 2024-10-28 14:04:30
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import * as z from "zod";
import { AlgorithmSchema } from "@/schemas";
import { addAlgorithm } from "@/data/algorithm";

export const addAlgorithmApi = async (
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
    const algorithm = await addAlgorithm({
      name,
      description,
      difficulty,
      approach,
      solution,
      tags,
    });
    return {
      code: 0,
      message: "Add algorithm success",
      data: algorithm,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Add algorithm failed",
      data: error,
    };
  }
};
