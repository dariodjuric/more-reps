import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  debug: false,
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
        },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials, req) => {
        return {
          id: 'dario',
        } as User;
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
