/*
 * @Author: Libra
 * @Date: 2024-07-12 17:25:24
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { updateSessionName } from "@/data/chat";

export const ModifySessionName = async (sessionId: string, name: string) => {
  try {
    const res = await updateSessionName(sessionId, name);
    return {
      code: 0,
      message: "Update session name success",
      data: res,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Update session name failed",
      data: null,
    };
  }
};
