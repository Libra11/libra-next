"use server";

import { code } from "@/common/code";
import { deleteAlgorithm } from "@/data/algorithm";

export const deleteAlgorithmApi = async (id: number) => {
  try {
    const algorithm = await deleteAlgorithm(id);
    return {
      code: 0,
      message: "Delete algorithm success",
      data: algorithm,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Delete algorithm failed",
      data: error,
    };
  }
};
