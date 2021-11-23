import { signIn, useSession, getSession, getProviders, ClientSafeProvider } from 'next-auth/client';
import { useRouter } from 'next/router';
import { makeStyles } from '@mui/styles';
import { Button, Grid, Typography, Container, Paper, Avatar, Box, Link } from '@mui/material';
// import styles from '../styles/Home.module.css';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    // padding: theme.spacing(3),
    textAlign: 'center',
  },
}));

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <h2>Masuk sebagai reviewer</h2>
      <Button
        variant='contained'
        color='primary'
        onClick={() => signIn('google', { callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard` })}
      >
        Masuk dengan Google
      </Button>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      session: await getSession(ctx)
    }
  }
}
