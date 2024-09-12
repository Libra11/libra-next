/*
 * @Author: Libra
 * @Date: 2024-09-11 11:15:26
 * @LastEditors: Libra
 * @Description:
 */
"use server";
import { code } from "@/common/code";
import { getParagraph } from "@/data/english";

export const getParagraphApi = async (id: number) => {
  try {
    const res = await getParagraph(id);
    return {
      code: 0,
      message: "get paragraph success",
      data: res,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "get paragraph failed",
      data: null,
    };
  }
};
