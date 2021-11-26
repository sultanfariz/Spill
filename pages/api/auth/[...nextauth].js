import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET,
      authorizationUrl:
        'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    }),
    // ...add more providers here
  ],
  jwt: {
    secret: process.env.JWT_SECRET,
    // expiresIn: '1d',
    maxAge: 24 * 60 * 60, // 1 day
  },
  secret: process.env.SECRET,
  session: {
    jwt: true,
    maxAge: 24 * 60 * 60, // 1 day
  },
  // Configure other settings
  // debug: true,
  callbacks: {
    redirect: async (url, _baseUrl) => {
      if (url) {
        // Redirect to a specific url
        return url;
      }
      // Redirect to the home page
      return '/';
    },
  },
});
