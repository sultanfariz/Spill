import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { makeStyles } from '@mui/styles';
import { useQuery } from '@apollo/client';
import { Box, Typography, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from '../../styles/Home.module.css';
import Loading from '../../src/components/Page/Loading';
import ErrorPage from '../../src/components/Page/Error';
import BookCard from '../../src/components/Card/BookCard';
import { GET_BOOK_BY_TITLE } from '../../src/libs/GraphQL/query';
import notFound from '../../public/not-found.png';

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

export default function SearchBook() {
  const classes = useStyles();
  const router = useRouter();
  const [session, loading] = useSession();
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [searchData, setSearchData] = useState([]);

  const {
    data: booksData,
    loading: booksLoading,
    error: booksError,
    refetch: booksRefetch,
  } = useQuery(GET_BOOK_BY_TITLE, {
    variables: { title: `%${keyword}%` },
  });

  useEffect(() => {
    if (booksData) {
      setSearchData(booksData.spill_book);
    }
  }, [booksData]);

  const handleChange = (e) => {
    e.preventDefault();
    // setKeyword(e.target.value);
    setTitle(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setKeyword(title);
    booksRefetch({
      variables: { title: `%${title}%` },
    });
  };

  if (booksLoading)
    return (
      <div className={classes.root}>
        <Loading />
      </div>
    );
  else if (!session?.user?.email) {
    router.push('/forbidden');
    return <></>;
  } else if (booksError)
    return (
      <div className={classes.root}>
        <ErrorPage />
      </div>
    );
  else {
    return (
      <main>
        {/* <NavTabs keyword={keyword} tab={tab} /> */}
        <Typography variant='h6' align='center' color='textPrimary' gutterBottom sx={{ margin: '10px 0' }}>
          Please choose a book first to review
        </Typography>
        {/* <form onSubmit={handleSubmit}> */}
        <Box component='form' onSubmit={(e) => handleSubmit(e)}>
          <TextField
            label='Title'
            name='title'
            type='text'
            // value={keyword}
            value={title}
            InputProps={{
              endAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleChange}
            variant='outlined'
            fullWidth
          />
        </Box>
        {/* </form> */}
        <br />
        {searchData.length === 0 ? (
          <Box style={{ textAlign: 'center' }}>
            {/* <Image src={notFound} alt='notfound' /> */}
            <Image src={notFound} alt='notfound' width='320px' height='280px' />
            <Typography
              variant='h6'
              align='center'
              color='textPrimary'
              gutterBottom
              sx={{ margin: '10px 0', fontSize: '16px' }}
            >
              {"Can't find the book you're looking for?"}
            </Typography>
            <Typography
              variant='h6'
              align='center'
              color='textPrimary'
              gutterBottom
              sx={{ margin: '10px 0', fontSize: '14px' }}
            >
              Insert new book <Link href='/book/insert'>here</Link>
            </Typography>
          </Box>
        ) : (
          <>
            <Typography
              variant='h6'
              align='center'
              color='textPrimary'
              gutterBottom
              sx={{ margin: '0 0 20px 0', fontSize: '16px' }}
            >
              {searchData.length} books found
            </Typography>
            <div className={styles.bookList}>
              {searchData?.map((book) => {
                return <BookCard book={book} key={book.id} />;
              })}
            </div>
          </>
        )}
      </main>
    );
  }
}
