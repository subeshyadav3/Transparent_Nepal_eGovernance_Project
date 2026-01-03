import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      kycVerified: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    kycVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    kycVerified: boolean;
  }
}
