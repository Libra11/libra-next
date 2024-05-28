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
import { generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      code: code.INVALID_INPUT,
      message: "Invalid input",
      data: null,
    };
  }
  const { email, password } = validatedFields.data;

  const exeistingUser = await getUserByEmail(email);
  if (!exeistingUser || !exeistingUser.password || !exeistingUser.email) {
    return {
      code: code.INVALID_CREDENTIALS,
      message: "Invalid credentials",
      data: null,
    };
  }

  // if (!exeistingUser.emailVerified) {
  //   const verificationToken = await generateVerificationToken(
  //     exeistingUser.email
  //   );
  //   return {
  //     code: 0,
  //     message: "Confirmation email sent!",
  //     data: verificationToken,
  //   };
  // }
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
