import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("http://localhost:3001/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        const data = await res.json();
        if (data?.success) return data.user;
        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt" as const, // ✅ แก้ตรงนี้
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | null }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.user && session.user) {
        session.user = token.user as typeof session.user;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
