/*
 * @Author: Libra
 * @Date: 2024-05-23 10:50:48
 * @LastEditors: Libra
 * @Description:
 */
"use server";

import { code } from "@/common/code";
import { LoginSchema } from "@/schemas";
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

  return {
    code: 0,
    message: "Success",
    data: null,
  };
};
