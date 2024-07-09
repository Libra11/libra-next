/*
 * @Author: Libra
 * @Date: 2024-06-26 15:49:13
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { modifyUser } from "@/data/user";

export const changeUserInfo = async (id: string, data: any) => {
  try {
    const user = await modifyUser(id, data);
    return {
      code: 0,
      message: "Change user info success",
      data: user,
    };
  } catch (error) {
    return {
      code: code.SERVER_ERROR,
      message: "Change user info failed",
      data: null,
    };
  }
};
