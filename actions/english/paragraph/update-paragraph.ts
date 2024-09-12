/*
 * @Author: Libra
 * @Date: 2024-09-12 10:51:11
 * @LastEditors: Libra
 * @Description:
 */
"use server";
import { code } from "@/common/code";
import { updateParagraph } from "@/data/english";
import { Paragraph } from "@prisma/client";

export type ParagraphData = Omit<Paragraph, "created_at">;

export const updateParagraphApi = async (data: ParagraphData) => {
  try {
    const updatedParagraph = await updateParagraph(data);
    if (updatedParagraph) {
      return { code: 0, data: updatedParagraph, message: "Update success" };
    } else {
      return { code: code.SERVER_ERROR, message: "Update failed" };
    }
  } catch (error) {
    return { code: code.SERVER_ERROR, message: "Update failed" };
  }
};
