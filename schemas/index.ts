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

export const ParagraphSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  audio_url: z.string(),
  srt_lyrics: z.string(),
  translation: z.string(),
  note: z.string(),
});

export const AlgorithmSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  approach: z.string().min(1, {
    message: "Approach is required",
  }),
  solution: z.string().min(1, {
    message: "Solution is required",
  }),
  tags: z.array(z.string()),
});
