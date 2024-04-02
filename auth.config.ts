import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { type NextAuthConfig } from "next-auth";
import prisma from "./lib/prisma";
import { hashPassword } from "./lib/utils";
import { AuthSchema } from "./lib/schema";
import {
  IncorrectPasswordError,
  InvalidFieldsError,
  UserNotFoundError,
} from "./lib/custom-errors";

export default {
  providers: [
    Google,
    Github,
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = AuthSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await prisma.user.findUnique({
            where: {
              email: email, // remind to convert to string
            },
          });

          if (!user || !user.hashedPassword) throw new UserNotFoundError();

          const passwordsMatch = hashPassword(
            password, // remind to convert to string
            user.salt!
          );

          if (!passwordsMatch) throw new IncorrectPasswordError();

          return user;
        }
        throw new InvalidFieldsError();
      },
    }),
  ],
} satisfies NextAuthConfig;
