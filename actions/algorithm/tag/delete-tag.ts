/*
 * @Author: Libra
 * @Date: 2024-10-28 14:04:24
 * @LastEditors: Libra
 * @Description: 
 */
"use server";

import { code } from "@/common/code";
import { deleteAlgorithmTag } from "@/data/algorithm";

export const deleteAlgorithmTagApi = async (id: number) => {
  try {
    const tag = await deleteAlgorithmTag(id);
    return {
      code: 0,
      message: "Delete algorithm tag success",
      data: tag,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Delete algorithm tag failed",
      data: error,
    };
  }
};
