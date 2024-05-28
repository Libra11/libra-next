/*
 * @Author: Libra
 * @Date: 2024-05-27 14:15:47
 * @LastEditors: Libra
 * @Description:
 */
import { getVerificationTokenByEmail } from "@/data/verficiationToken";
import { v4 } from "uuid";
import { db } from "./db";
import { getPasswordResetByEmail } from "@/data/password-reset-token";

export const generateVerificationToken = async (email: string) => {
  const token = v4();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 10);
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      token,
      expires,
      email,
    },
  });
  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = v4();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 10);
  const existingToken = await getPasswordResetByEmail(email);
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      token,
      expires,
      email,
    },
  });
  return passwordResetToken;
};
