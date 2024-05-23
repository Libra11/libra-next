/*
 * @Author: Libra
 * @Date: 2024-05-23 13:44:07
 * @LastEditors: Libra
 * @Description:
 */
import { PrismaClient } from "@prisma/client";

declare global {
  var primsa: PrismaClient | undefined;
}

export const db = globalThis.primsa || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.primsa = db;
}
