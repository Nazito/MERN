import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NEXTAUTH_BASE_PATH } from "@/lib/authBasePath";

export { NEXTAUTH_BASE_PATH };

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5001";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            (data as { message?: string })?.message || "Login failed"
          );
        }

        const user = (data as {
          loginToken?: string;
          user?: { userId?: string; name?: string; avatar?: string | null };
        }).user;
        const loginToken = (data as { loginToken?: string }).loginToken;

        if (!loginToken || !user?.userId) {
          return null;
        }

        return {
          id: String(user.userId),
          name: user.name || "Member",
          email: credentials.email,
          avatar: user.avatar || null,
          accessToken: loginToken,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // align with Express JWT 1h
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.userId = user.id;
        token.name = user.name;
        token.avatar = user.avatar ?? null;
        token.email = user.email;
      }

      // Allow client to update name/avatar after profile edit
      if (trigger === "update" && session) {
        if (typeof session.name === "string") token.name = session.name;
        if ("avatar" in session) {
          token.avatar = (session.avatar as string | null) ?? null;
        }
        if (typeof session.accessToken === "string") {
          token.accessToken = session.accessToken;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.user = {
        ...session.user,
        id: token.userId as string,
        userId: token.userId as string,
        name: (token.name as string) || session.user?.name || "Member",
        email: (token.email as string) || session.user?.email,
        avatar: (token.avatar as string | null) ?? null,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
