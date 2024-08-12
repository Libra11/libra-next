/**
 * Author: Libra
 * Date: 2024-08-08 10:30:36
 * LastEditors: Libra
 * Description:
 */
"use server";

import { code } from "@/common/code";
import { deleteCategory } from "@/data/interview";

export const deleteCategoryApi = async (id: number) => {
  try {
    const category = await deleteCategory(id);
    return {
      code: 0,
      message: "Delete category success",
      data: category,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Delete category failed",
      data: error,
    };
  }
};
