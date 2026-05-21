import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "FREE" | "PREMIUM"
      name: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: "FREE" | "PREMIUM"
    name: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "FREE" | "PREMIUM"
    name: string
  }
}