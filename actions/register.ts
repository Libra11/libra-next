/*
 * @Author: Libra
 * @Date: 2024-05-23 13:41:00
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { hash } from "bcrypt";
import * as z from "zod";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      code: code.INVALID_INPUT,
      message: "Invalid input",
      data: null,
    };
  }

  const { email, password, name } = values;
  const hashedPassword = await hash(password, 10);

  const exeistingUser = await getUserByEmail(email);

  if (exeistingUser) {
    return {
      code: code.USER_ALREADY_EXISTS,
      message: "Email already exists",
      data: null,
    };
  }

  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return {
    code: 0,
    message: "User created successfully!",
    data: null,
  };
};
