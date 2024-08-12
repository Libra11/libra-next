/**
 * Author: Libra
 * Date: 2024-08-08 10:34:26
 * LastEditors: Libra
 * Description:
 */
"use server";

import { code } from "@/common/code";
import { getCategories } from "@/data/interview";

export const getCategoriesApi = async () => {
  try {
    const categories = await getCategories();
    return {
      code: 0,
      message: "Get categories success",
      data: categories,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Get categories failed",
      data: error,
    };
  }
};
