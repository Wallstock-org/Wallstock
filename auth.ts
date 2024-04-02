import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import prisma from "./lib/prisma";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,

  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  ...authConfig,
});
