/*
 * @Author: Libra
 * @Date: 2024-05-23 10:25:04
 * @LastEditors: Libra
 * @Description:
 */
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

export const InterviewQuestionSchema = z.object({
  category: z.string(),
  questionText: z.string(),
  answerContent: z.string(),
  tags: z.array(z.string()),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  isActive: z.optional(z.boolean()),
});
