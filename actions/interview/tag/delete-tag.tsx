/**
 * Author: Libra
 * Date: 2024-08-08 10:30:36
 * LastEditors: Libra
 * Description:
 */
"use server";

import { code } from "@/common/code";
import { deleteTag } from "@/data/interview";

export const deleteTagApi = async (id: number) => {
  try {
    const tag = await deleteTag(id);
    return {
      code: 0,
      message: "Delete tag success",
      data: tag,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Delete tag failed",
      data: error,
    };
  }
};
