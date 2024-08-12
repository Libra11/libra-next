/**
 * Author: Libra
 * Date: 2024-08-08 10:34:26
 * LastEditors: Libra
 * Description:
 */
"use server";

import { code } from "@/common/code";
import { getTags } from "@/data/interview";

export const getTagsApi = async () => {
  try {
    const tags = await getTags();
    return {
      code: 0,
      message: "Get tags success",
      data: tags,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Get tags failed",
      data: error,
    };
  }
};
