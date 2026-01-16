/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

/**
 * NextAuth Configuration
 * Centralized authentication configuration for the application
 */
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Server-side session helper
 * For use in server components and API routes
 * 
 * Note: This is a placeholder for future Auth.js v5 migration.
 * In v5, you would use the `auth()` function from NextAuth.
 * For now, use getServerSession from next-auth in server components:
 * 
 * import { getServerSession } from "next-auth";
 * import { authOptions } from "@/lib/auth";
 * const session = await getServerSession(authOptions);
 */
export async function getSession() {
  // This is a placeholder for v5 migration
  // In production, use getServerSession from next-auth/next
  console.warn('Use getServerSession from next-auth in server components');
  return null;
}

