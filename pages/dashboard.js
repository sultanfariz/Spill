import Head from 'next/head';
import Image from 'next/image';
import { useSession, getSession, signIn, getProviders, ClientSafeProvider } from 'next-auth/client';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
// import { ReactComponent as Forbidden } from '../public/forbidden.webp';
import forbidden from '../public/forbidden.webp';
import { makeStyles } from '@mui/styles';
import { Button, Grid, Typography, Container, Paper, Avatar, Box, Link } from '@mui/material';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forbidden: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const router = useRouter();
  const [session, loading] = useSession();
  if (loading) {
    return (<><p>{session}</p>
      <p>Loading...</p></>)
  } else if (!session?.user?.email) {
    return (
      <div className={classes.forbidden}>
        <Image src={forbidden} alt="forbidden" />
        <p>You are not signed in.</p>
        <p>Please sign in to continue.</p>
        <Button
          variant='contained'
          color='primary'
          onClick={() => signIn('google', { callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard` })}
        >
          Masuk dengan Google
        </Button>
      </div>
    );
  } else {
    return (
      <>
        <main className={styles.main}>
          <h1 className={styles.title}>
            {/* Welcome to <a href='https://nextjs.org'>Next.js!</a> */}
            Welcome to <span style={{
              color: '#6200EE',
            }}>Spill!</span>
          </h1>

          <p className={styles.description}>
            Get started by editing <code className={styles.code}>pages/index.js</code>
          </p>

          <div className={styles.grid}>
            <a href='https://nextjs.org/docs' className={styles.card}>
              <h2>Documentation &rarr;</h2>
              <p>Find in-depth information about Next.js features and API.</p>
            </a>

            <a href='https://nextjs.org/learn' className={styles.card}>
              <h2>Learn &rarr;</h2>
              <p>Learn about Next.js in an interactive course with quizzes!</p>
            </a>

            <a href='https://github.com/vercel/next.js/tree/master/examples' className={styles.card}>
              <h2>Examples &rarr;</h2>
              <p>Discover and deploy boilerplate example Next.js projects.</p>
            </a>

            <a
              href='https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
              className={styles.card}
            >
              <h2>Deploy &rarr;</h2>
              <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
            </a>
          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
            </span>
          </a>
        </footer>
      </>
    );
  }
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      session: await getSession(ctx)
    }
  }
}