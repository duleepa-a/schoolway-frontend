import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      username?: string;
      servicename?: string;
    };
  }

  interface User {
    role?: string;
    username?: string;
    servicename?: string;
  }

  interface JWT {
    role?: string;
    username?: string;
    servicename?: string
  }
}
