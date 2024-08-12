/**
 * Author: Libra
 * Date: 2024-08-08 10:39:23
 * LastEditors: Libra
 * Description:
 */
"use server";

import { code } from "@/common/code";
import { addCategory } from "@/data/interview";

export const addCategoryApi = async (name: string) => {
  try {
    const category = await addCategory(name);
    if (typeof category === "string") {
      return {
        code: code.CATEGORY_ALREADY_EXISTS,
        message: category,
        data: null,
      };
    }
    return {
      code: 0,
      message: "Add category success",
      data: category,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Add category failed",
      data: error,
    };
  }
};
