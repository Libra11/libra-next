"use server";

import { code } from "@/common/code";
import { addAlgorithmTag } from "@/data/algorithm";

export const addAlgorithmTagApi = async (name: string) => {
  try {
    const tag = await addAlgorithmTag(name);
    if (typeof tag === "string") {
      return {
        code: code.TAG_ALREADY_EXISTS,
        message: tag,
        data: null,
      };
    }
    return {
      code: 0,
      message: "Add algorithm tag success",
      data: tag,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Add algorithm tag failed",
      data: error,
    };
  }
};
