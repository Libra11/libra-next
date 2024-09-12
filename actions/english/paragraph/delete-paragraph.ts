/*
 * @Author: Libra
 * @Date: 2024-09-11 11:18:22
 * @LastEditors: Libra
 * @Description:
 */
"use server";
import { code } from "@/common/code";
import { deleteParagraph } from "@/data/english";

export const deleteParagraphApi = async (id: number) => {
  try {
    const res = await deleteParagraph(id);
    return {
      code: 0,
      message: "delete paragraph success",
      data: res,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "delete paragraph failed",
      data: null,
    };
  }
};
