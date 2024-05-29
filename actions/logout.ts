/*
 * @Author: Libra
 * @Date: 2024-05-29 11:18:45
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  await signOut();
};
