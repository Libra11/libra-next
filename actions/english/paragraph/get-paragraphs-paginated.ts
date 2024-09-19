/*
 * @Author: Libra
 * @Date: 2024-09-18 10:39:02
 * @LastEditors: Libra
 * @Description:
 */
"use server";
import { code } from "@/common/code";
import { getParagraphsPaginated } from "@/data/english";

export const getParagraphsPaginatedApi = async (
  page: number = 1,
  pageSize: number = 20
) => {
  try {
    const result = await getParagraphsPaginated(page, pageSize);
    if (result) {
      return {
        code: 0,
        message: "get paragraphs paginated success",
        data: result,
      };
    } else {
      throw new Error("get paragraphs paginated failed");
    }
  } catch (error) {
    console.error("get paragraphs paginated failed:", error);
    return {
      code: code.SERVER_ERROR,
      message: "get paragraphs paginated failed",
      data: null,
    };
  }
};
