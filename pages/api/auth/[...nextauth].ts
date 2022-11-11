import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  debug: false,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Username',
          type: 'text',
        },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        return authorizeUser(credentials.email, credentials.password);
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    error: '/error',
    signOut: '/my-profile',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
};
export default NextAuth(authOptions);

async function authorizeUser(
  email: string,
  password: string
): Promise<User | null> {
  const dbUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  let authUser = null;
  if (dbUser != null) {
    const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);

    if (isPasswordCorrect) {
      authUser = { id: `${dbUser.id}`, email: dbUser.email } as User;
    }
  }

  return authUser;
}
