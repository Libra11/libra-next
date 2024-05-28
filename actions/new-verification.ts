/*
 * @Author: Libra
 * @Date: 2024-05-28 13:50:15
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verficiationToken";
import { db } from "@/lib/db";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return {
      code: code.TOKEN_NOT_EXIST,
      message: "Token not exist",
      data: null,
    };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {
      code: code.TOKEN_EXPIRED,
      message: "Token expired",
      data: null,
    };
  }

  const exeistingUser = await getUserByEmail(existingToken.email);

  if (!exeistingUser) {
    return {
      code: code.USER_NOT_EXIST,
      message: "User not exist",
      data: null,
    };
  }

  await db.user.update({
    where: {
      id: exeistingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    code: 0,
    message: "Email verified successfully!",
    data: null,
  };
};
