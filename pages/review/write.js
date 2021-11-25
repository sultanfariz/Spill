import Image from 'next/image';
import { useEffect } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { makeStyles } from '@mui/styles';
import { Autocomplete, TextField, Button, Typography, Container, Link, Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery, useMutation } from '@apollo/client';
import styles from '../../styles/Home.module.css';
import Loading from '../../src/components/Page/Loading';
import { FForm, FTextField } from '@formulir/material-ui';
import { GET_BOOK_BY_ISBN } from '../../src/libs/GraphQL/query';

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

export default function Dashboard() {
  const classes = useStyles();
  const router = useRouter();
  const [session, loading] = useSession();
  const [search, setSearch] = useState('');
  const [isbn, setIsbn] = useState('');
  const initialValues = {
    summary: '',
    section: {
      initialValues: [],
      validation: 'array',
    },
  };

  const {
    data: getByISBNData,
    loading: getByISBNLoading,
    error: getByISBNError,
    get,
  } = useQuery(GET_BOOK_BY_ISBN, { variables: { isbn } });

  // useEffect(() => {
  //   if (!session?.user?.email) {
  //     router.push('/forbidden');
  //   }
  // }, [session]);

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  } else if (!session?.user?.email) {
    router.push('/forbidden');
    return <></>;
  } else {
    return (
      <>
        <main className={styles.main}>
          <Typography variant='h6' align='center' color='textPrimary' gutterBottom sx={{ marginBottom: '10px' }}>
            Insert your review here
          </Typography>

          {/* <Autocomplete
            id="combo-box-demo"
            options={data */}
          <TextField
            id='input-with-icon-textfield'
            label='ISBN'
            variant='outlined'
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <br />
          {/* <FForm
            onSubmit={(values) => { }}
          initialValues={initialValues}
          > */}
          <TextField id='outlined-basic' label='Summary' variant='outlined' fullWidth multiline />
          <br />
          <TextField id='outlined-basic' label='Heading' variant='outlined' fullWidth multiline />
          <br />
          <TextField id='outlined-basic' label='Body' variant='outlined' fullWidth multiline />
          {/* </FForm> */}
          <br />
        </main>
      </>
    );
  }
}
