"use server";

import { code } from "@/common/code";
import { getAlgorithm } from "@/data/algorithm";

export const getAlgorithmApi = async (id: number) => {
  try {
    const algorithm = await getAlgorithm(id);
    return {
      code: 0,
      message: "Get algorithm success",
      data: algorithm,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Get algorithm failed",
      data: error,
    };
  }
};
