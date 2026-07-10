import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import connectDB from "./mongodb";
import User from "@/models/User";
import Settings from "@/models/Settings";
import { verify } from "otplib";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        token: { label: "2FA Token", type: "text" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email);
        const password = String(credentials.password);

        if (
          email === adminEmail &&
          password === adminPassword
        ) {
          await connectDB();
          const settings = await Settings.findOne();
          
          if (settings?.security?.isTwoFactorEnabled) {
            const token = credentials.token ? String(credentials.token) : null;
            if (!token) {
              throw new Error("2FA_REQUIRED");
            }
            
            const isValid = verify({ 
              token, 
              secret: settings.security.twoFactorSecret 
            });
            
            if (!isValid) {
              throw new Error("2FA_INVALID");
            }
          }

          return {
            id: "1",
            email: adminEmail,
            name: "Admin",
            role: "admin",
          };
        }

        try {
          await connectDB();
          const user = await User.findOne({ email: email.toLowerCase() });
          
          if (!user) return null;

          const hashedPassword = Buffer.from(password).toString("base64");
          if (user.password !== hashedPassword) return null;

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: "user",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          if (!user.email) return false;
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            await User.create({
              name: user.name || user.email.split("@")[0] || "User",
              email: user.email,
              password: "",
              phone: "",
            });
          }
        } catch (error) {
          console.error("Google sign in error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
});
