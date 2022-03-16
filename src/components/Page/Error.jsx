import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Button } from '@mui/material';
import somethingWentWrong from '../../../public/something-went-wrong.png';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
  text: {
    margin: '5px auto',
  },
}));

export default function NotFoundPage() {
  const classes = useStyles();
  const router = useRouter();

  return (
    <div className={classes.root}>
      <Image src={somethingWentWrong} alt='Something went wrong' />
      <h2 style={{ margin: '5px auto' }}>Oops! Something went wrong.</h2>
      <p className={classes.text}>You can try again later or go back to the home page.</p>
      <Button
        variant='contained'
        color='primary'
        style={{ marginTop: '15px' }}
        // redirect to homepage
        onClick={() => router.push('/')}
      >
        Back to Homepage
      </Button>
    </div>
  );
}
