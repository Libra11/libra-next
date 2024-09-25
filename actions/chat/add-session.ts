/*
 * @Author: Libra
 * @Date: 2024-07-09 15:18:48
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { Session } from "@/app/main/chat/sessionList";
import { code } from "@/common/code";
import { AddSession } from "@/data/chat";

export const addSessions = async (userId: string) => {
  try {
    const session: Session | null = await AddSession(userId);
    return {
      code: 0,
      message: "Add session success",
      data: session,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Add session failed",
      data: null,
    };
  }
};
