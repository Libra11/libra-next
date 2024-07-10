/*
 * @Author: Libra
 * @Date: 2024-07-09 16:05:46
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { GetMessage, GetSession } from "@/data/gemini";

export const getMessages = async (userId: string) => {
  try {
    const session = await GetMessage(userId);
    return {
      code: 0,
      message: "Get messages success",
      data: session,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Get messages failed",
      data: null,
    };
  }
};
