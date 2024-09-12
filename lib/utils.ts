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

export function parseSrt(srtContent: string) {
  const srtArray = srtContent.trim().split("\n\n");
  const captions = srtArray.map((block) => {
    const lines = block.split("\n");
    const index = lines[0];
    const times = lines[1].split(" --> ");
    const startTime = toMilliseconds(times[0].trim());
    const endTime = toMilliseconds(times[1].trim());
    const text = lines.slice(2).join("\n");
    return { index, startTime, endTime, text };
  });

  return captions;
}

export function toMilliseconds(timeString: string) {
  const [hours, minutes, seconds] = timeString.split(":");
  const [secs, ms] = seconds.split(",");
  return (
    parseInt(hours) * 3600000 +
    parseInt(minutes) * 60000 +
    parseInt(secs) * 1000 +
    parseInt(ms)
  );
}
