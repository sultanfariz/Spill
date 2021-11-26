import { makeStyles } from '@mui/styles';
import Image from 'next/image';
import notFound from '../../../public/not-found.png';

const useStyles = makeStyles((theme) => ({
  root: {
    // width: '100%',
    // height: '100%',
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
  return (
    <div className={classes.root}>
      <Image src={notFound} alt='notfound' />
      {/* <h1 style={{ margin: '5px auto' }}>{`Can't find anything matches the search`}</h1> */}
      <h1 style={{ margin: '5px auto' }}>No results were found for your search.</h1>
      {/* <p className={classes.text}>No results were found for your search.</p> */}
    </div>
  );
}
