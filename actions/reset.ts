/*
 * @Author: Libra
 * @Date: 2024-05-28 14:44:12
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import * as z from "zod";
import { sendResetMail } from "./email";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      code: code.INVALID_INPUT,
      message: "Invalid input",
      data: null,
    };
  }

  const { email } = validatedFields.data;
  const exeistingUser = await getUserByEmail(email);

  if (!exeistingUser) {
    return {
      code: code.USER_NOT_EXIST,
      message: "User not exist",
      data: null,
    };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendResetMail(passwordResetToken.email, passwordResetToken.token);

  return {
    code: 0,
    message: "Success",
    data: null,
  };
};
