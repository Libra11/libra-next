/*
 * @Author: Libra
 * @Date: 2024-07-09 15:44:14
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { GetSession } from "@/data/chat";

export const getSessions = async (userId: string) => {
  try {
    const session = await GetSession(userId);
    return {
      code: 0,
      message: "Get session success",
      data: session,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Get session failed",
      data: null,
    };
  }
};
