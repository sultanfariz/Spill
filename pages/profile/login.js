import { makeStyles } from '@mui/styles';
import Image from 'next/image';
import { Button } from '@mui/material';
import router from 'next/router';
import { signIn, useSession } from 'next-auth/client';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function Login() {
  const classes = useStyles();
  const [session, loading] = useSession();

  return (
    !session && (
      <div className={classes.root}>
        <h2>Login as reviewer</h2>
        <Button
          variant='contained'
          color='primary'
          onClick={() => signIn('google', { callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard` })}
        >
          Login with Google
        </Button>
      </div>
    )
  );
}
