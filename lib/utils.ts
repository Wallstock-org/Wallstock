import { type ClassValue, clsx } from "clsx";
import { randomBytes } from "crypto";
import bcryptjs from "bcryptjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashPassword(password: string): string {
  var hashed = bcryptjs.hashSync(password); // GOOD
  return hashed;
}

export const generateSalt = (size?: number) => bcryptjs.genSaltSync(size ?? 16); // GOOD
