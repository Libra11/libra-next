/*
 * @Author: Libra
 * @Date: 2024-07-09 17:17:27
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { DeleteSession } from "@/data/chat";

export const deleteSession = async (sessionId: string) => {
  try {
    await DeleteSession(sessionId);
    return {
      code: 0,
      message: "Delete session success",
      data: null,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Delete session failed",
      data: null,
    };
  }
};
