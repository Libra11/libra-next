/*
 * @Author: Libra
 * @Date: 2024-10-28 14:04:37
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { getAlgorithms } from "@/data/algorithm";

export const getAlgorithmsApi = async (
  page: number = 1,
  pageSize: number = 20
) => {
  try {
    const result = await getAlgorithms(page, pageSize);
    return {
      code: 0,
      message: "Get algorithms success",
      data: result,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Get algorithms failed",
      data: error,
    };
  }
};
