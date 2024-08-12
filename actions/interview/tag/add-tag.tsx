/**
 * Author: Libra
 * Date: 2024-08-08 10:30:29
 * LastEditors: Libra
 * Description:
 */
"use server";

import { code } from "@/common/code";
import { addTag } from "@/data/interview";

export const addTagApi = async (name: string) => {
  try {
    const tag = await addTag(name);
    if (typeof tag === "string") {
      return {
        code: code.TAG_ALREADY_EXISTS,
        message: tag,
        data: null,
      };
    }
    return {
      code: 0,
      message: "Add tag success",
      data: tag,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Add tag failed",
      data: error,
    };
  }
};
