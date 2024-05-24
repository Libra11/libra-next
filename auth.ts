/*
 * @Author: Libra
 * @Date: 2024-05-23 14:48:24
 * @LastEditors: Libra
 * @Description:
 */
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getUserById } from "./data/user";

declare module "next-auth" {
  interface User {
    role: "ADMIN" | "USER";
  }
  interface Session {
    user?: User;
  }
}
declare module "@auth/core/jwt" {
  interface JWT {
    role: "ADMIN" | "USER";
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const exeistingUser = await getUserById(token.sub);
      if (!exeistingUser) return token;
      token.role = exeistingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
