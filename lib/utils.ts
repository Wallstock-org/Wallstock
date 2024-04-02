import { type ClassValue, clsx } from "clsx";
import { createHash, randomBytes } from "crypto";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashPassword(password: string, salt: string): string {
  const hash = createHash("sha256");
  hash.update(password + salt);
  return hash.digest("hex");
}

export const generateSalt = (size?: number) =>
  randomBytes(size ?? 16).toString("hex");
