import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

// --- Extend default types for NextAuth ---
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "CITIZEN";
      kycVerified: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "ADMIN" | "CITIZEN";
    kycVerified: boolean;
  }

  interface JWT {
    role: "ADMIN" | "CITIZEN";
    kycVerified: boolean;
  }
}

// --- NextAuth options ---
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const validPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!validPassword) return null;

        return user; // return full user object
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      // jwt callback
      if (user) {
        token.role = user.role as "ADMIN" | "CITIZEN";
        token.kycVerified = user.kycVerified;
      }

      return token;
    },
    async session({ session, token }) {
      // session callback
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as "ADMIN" | "CITIZEN";
        session.user.kycVerified = token.kycVerified;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
