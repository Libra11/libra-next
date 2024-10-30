"use server";

import { code } from "@/common/code";
import { getAlgorithmTags } from "@/data/algorithm";

export const getAlgorithmTagsApi = async () => {
  try {
    const tags = await getAlgorithmTags();
    return {
      code: 0,
      message: "Get algorithm tags success",
      data: tags,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Get algorithm tags failed",
      data: error,
    };
  }
};
