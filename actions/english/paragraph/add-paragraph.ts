/*
 * @Author: Libra
 * @Date: 2024-09-11 11:12:36
 * @LastEditors: Libra
 * @Description:
 */
"use server";
import { ParagraphFormData } from "@/app/main/english/paragraph/components/add-paragraph-dialog";
import { code } from "@/common/code";
import { addParagraph } from "@/data/english";

export const addParagraphApi = async (phragraph: ParagraphFormData) => {
  try {
    const res = await addParagraph(phragraph);
    return {
      code: 0,
      message: "add paragraph success",
      data: res,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "add paragraph failed",
      data: null,
    };
  }
};
