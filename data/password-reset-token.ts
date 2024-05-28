/*
 * @Author: Libra
 * @Date: 2024-05-28 14:51:12
 * @LastEditors: Libra
 * @Description:
 */
import { db } from "@/lib/db";

export const getPasswordResetByToken = async (token: string) => {
  try {
    const passwordToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    });
    return passwordToken;
  } catch {
    return null;
  }
};

export const getPasswordResetByEmail = async (email: string) => {
  try {
    const passwordToken = await db.passwordResetToken.findFirst({
      where: {
        email,
      },
    });
    return passwordToken;
  } catch {
    return null;
  }
};
