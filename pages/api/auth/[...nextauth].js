import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      async authorize() {
        return {
          username: 'dario',
        };
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
