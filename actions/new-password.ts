/*
 * @Author: Libra
 * @Date: 2024-05-28 15:07:34
 * @LastEditors: Libra
 * @Description:
 */
"use server";
import { code } from "@/common/code";
import {
  getPasswordResetByEmail,
  getPasswordResetByToken,
} from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { NewPasswordSchema } from "@/schemas";
import { hash } from "bcryptjs";
import * as z from "zod";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string
) => {
  if (!token) {
    return {
      code: code.TOKEN_NOT_EXIST,
      message: "Token not exist",
      data: null,
    };
  }
  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      code: code.INVALID_INPUT,
      message: "Invalid input",
      data: null,
    };
  }
  const { password } = validatedFields.data;
  const existingToken = await getPasswordResetByToken(token);

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

  const hashedPassword = await hash(password, 10);
  await db.user.update({
    where: {
      id: exeistingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    code: 0,
    message: "Password updated successfully!",
    data: null,
  };
};
