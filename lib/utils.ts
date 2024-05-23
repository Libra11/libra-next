/*
 * @Author: Libra
 * @Date: 2024-05-22 15:45:50
 * @LastEditors: Libra
 * @Description:
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
