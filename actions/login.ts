/*
 * @Author: Libra
 * @Date: 2024-05-23 10:50:48
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { signIn } from "@/auth";
import { code } from "@/common/code";
import { getUserByEmail } from "@/data/user";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";
import { sendMail, sendTwoFactorMail } from "./email";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      code: code.INVALID_INPUT,
      message: "Invalid input",
      data: null,
    };
  }
  const { email, password, code: twoFactorCode } = validatedFields.data;

  const exeistingUser = await getUserByEmail(email);
  if (!exeistingUser || !exeistingUser.password || !exeistingUser.email) {
    return {
      code: code.INVALID_CREDENTIALS,
      message: "Invalid credentials",
      data: null,
    };
  }

  if (!exeistingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      exeistingUser.email
    );
    await sendMail(verificationToken.email, verificationToken.token);
    return {
      code: 0,
      message: "Confirmation email sent!",
      data: exeistingUser.isTwoFactorEnabled,
    };
  }

  if (exeistingUser.isTwoFactorEnabled && exeistingUser.email) {
    if (twoFactorCode) {
      const twoFactorToken = await getTwoFactorTokenByEmail(
        exeistingUser.email
      );
      if (!twoFactorToken || twoFactorToken.token !== twoFactorCode) {
        return {
          code: code.INVALID_TWO_FACTOR,
          message: "Invalid two factor code",
          data: null,
        };
      }
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return {
          code: code.TOKEN_EXPIRED,
          message: "Two factor code has expired",
          data: null,
        };
      }
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        exeistingUser.id
      );
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: exeistingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(exeistingUser.email);
      await sendTwoFactorMail(twoFactorToken.email, twoFactorToken.token);
      return {
        code: 0,
        message: "Two factor email sent!",
        data: true,
      };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            code: code.INVALID_CREDENTIALS,
            message: "Invalid credentials",
            data: null,
          };
        default:
          return {
            code: code.SERVER_ERROR,
            message: "Server error",
            data: null,
          };
      }
    }
    throw error;
  }
};
