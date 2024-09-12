/**
 * Author: Libra
 * Date: 2024-09-11 11:17:25
 * LastEditors: Libra
 * Description:
 */
"use server";
import { code } from "@/common/code";
import { getParagraphs } from "@/data/english";

export const getParagraphsApi = async () => {
  try {
    const res = await getParagraphs();
    return {
      code: 0,
      message: "get paragraphs success",
      data: res,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "get paragraphs failed",
      data: null,
    };
  }
};
