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
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

declare module "next-auth" {
  interface User {
    role: "ADMIN" | "USER";
    isTwoFactorEnabled: boolean;
  }
  interface Session {
    user?: User;
  }
}
declare module "@auth/core/jwt" {
  interface JWT {
    role: "ADMIN" | "USER";
    isTwoFactorEnabled: boolean;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      if (!user.id) return false;
      const exeistingUser = await getUserById(user.id);

      if (!exeistingUser?.emailVerified) return false;

      if (exeistingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          exeistingUser.id
        );
        if (!twoFactorConfirmation) return false;
        // Delete the two factor confirmation token for next sign in
        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const exeistingUser = await getUserById(token.sub);
      if (!exeistingUser) return token;
      token.role = exeistingUser.role;
      token.isTwoFactorEnabled = exeistingUser.isTwoFactorEnabled;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
