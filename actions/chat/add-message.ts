/*
 * @Author: Libra
 * @Date: 2024-07-09 16:05:40
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { AddMessage } from "@/data/chat";

export const addMessages = async (
  sessionId: string,
  content: string,
  sender: string
) => {
  try {
    const message = await AddMessage(sender, sessionId, content);
    return {
      code: 0,
      message: "Add message success",
      data: message,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Add message failed",
      data: null,
    };
  }
};
