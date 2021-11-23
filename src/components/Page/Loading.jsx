import Image from 'next/image';
import { makeStyles } from '@mui/styles';
import loadingSVG from '../../../public/loading.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function Loading() {
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <Image src={loadingSVG} width={200} height={200} alt='loading' />
      </div>
    </>
  );
}
