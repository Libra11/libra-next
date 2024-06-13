/*
 * @Author: Libra
 * @Date: 2024-05-24 10:20:00
 * @LastEditors: Libra
 * @Description:
 */
export const publicRoutes = ["/", "/auth/new-verification"];

export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/main";
