/*
 * @Author: Libra
 * @Date: 2024-05-29 10:27:33
 * @LastEditors: Libra
 * @Description:
 */
import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: {
        userId,
      },
    });
    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};
