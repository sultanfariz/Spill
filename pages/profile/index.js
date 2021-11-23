import { makeStyles } from '@mui/styles';
import Image from 'next/image';
import { Button } from '@mui/material';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { signIn, useSession, signOut } from 'next-auth/client';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_BY_EMAIL } from '../../src/libs/GraphQL/query'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.primary,
    marginTop: '45px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    margin: '5px auto',
  },
  roundedImage: {
    width: '125px',
    height: '125px',
    borderRadius: '50%',
  },
  horizontalLine: {
    height: 0,
    width: '100%',
    border: '1px solid #909090',
    margin: '30px 0',
  },
}));

export function auth() {
  signIn('google', { callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/` });
}

export default function Profile() {
  const classes = useStyles();
  const [session, loading] = useSession();
  const [email, setEmail] = useState(session ? session.user.email : '');
  const {
    data: getByEmailData,
    loading: getByEmailLoading,
    error: getByEmailError
  } = useQuery(GET_USER_BY_EMAIL, { variables: { email } });

  console.log('session', session);
  console.log('getByEmailData', getByEmailData);

  useEffect(() => {
    setEmail(session ? session.user?.email : '');
  }, [session]);

  if (!session) {
    return (
      <div className={classes.container}>
        <h2>Login as reviewer</h2>
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            signIn('google', {
              callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
            });
            setEmail(session.user.email);
          }}
        >
          Login with Google
        </Button>
      </div >
    );
  } else
    return (
      <div className={classes.root}>
        <Image
          className={classes.roundedImage}
          src={session?.user?.image}
          width={125}
          height={125}
          alt={session?.user?.name}
        />
        <h2 style={{ marginBottom: '5px' }}>{session?.user?.name}</h2>
        <p className={classes.text}>{session?.user?.email}</p>
        <Button style={{ marginTop: '15px' }} variant='contained' color='primary' onClick={() => signOut()}>
          Sign out
        </Button>
        <div className={classes.horizontalLine}></div>
      </div>
    );
}
