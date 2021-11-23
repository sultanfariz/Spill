import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET,
      // authorizationUrl:
      //     'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    }),
    // ...add more providers here
  ],
  jwt: {
    secret: process.env.JWT_SECRET,
    // expiresIn: '1d',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
  secret: process.env.SECRET,
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  // Configure other settings
  // debug: true,
  callbacks: {
    // async jwt({ token, account }) {
    //     console.log('JWT', token, account);
    //     if (account?.accessToken) {
    //         token.accessToken = account.accessToken;
    //     }
    //     return token;
    // },
    // async session({ session, user, token }) {
    // async session(session, token, user) {
    //     // console.log('session', session);
    //     // console.log('token', token);
    //     // console.log('user', user);
    //     // session.accessToken = token.accessToken;
    //     return session;
    // },
    // async signIn({ user, account, profile, email, credentials }) {
    // async signIn(user, account, profile, email, credentials) {
    //     // Do something with the user and account
    //     console.log(user, account, profile, email, credentials);
    //     return true;
    //     //     if (user.email) {
    //     //         return true;
    //     //     }
    //     //     return false;
    // },
    // signOut: async (user, account, session, accessToken, refreshToken) => {
    //     // Do something with the user and account
    //     // console.log(user, account, session, accessToken, refreshToken)
    //     // done(null, user, account, session, accessToken, refreshToken);
    //     if (session) {
    //         await session.destroy();
    //     }
    // },
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
