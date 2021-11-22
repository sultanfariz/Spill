import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
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
        expiresIn: '1d',
    },
    secret: process.env.SECRET,
    session: {
        jwt: true,
    },
    // Configure other settings
    // debug: true,
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = user.access_token;
            }
            return token;
        },
        async session({ session, token, user }) {
            session.accessToken = token.accessToken;
            return session;
        },
        signIn: async (user, account, profile, session, accessToken, refreshToken, done) => {
            // Do something with the user and account
            console.log(user, account, profile, session, accessToken, refreshToken);
            if (user.email) {
                return true;
            }
            return false;
        },
        signOut: async (user, account, session, accessToken, refreshToken, done) => {
            // Do something with the user and account
            // console.log(user, account, session, accessToken, refreshToken)
            done(null, user, account, session, accessToken, refreshToken);
            if (session) {
                await session.destroy();
            }
        },
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
