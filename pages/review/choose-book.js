import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@mui/styles';
import { useQuery } from '@apollo/client';
import { Typography, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from '../../styles/Home.module.css';
import { FButton, FForm, FTextField } from '@formulir/material-ui';
import Loading from '../../src/components/Page/Loading';
import ErrorPage from '../../src/components/Page/Error';
import BookCard from '../../src/components/Card/BookCard';
import { GET_ALL_BOOKS, GET_BOOK_BY_TITLE } from '../../src/libs/GraphQL/query';

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
  const [keyword, setKeyword] = useState('');
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
      console.log(booksData);
      setSearchData(booksData.spill_book);
    }
  }, [booksData]);

  const handleChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value);
  };


  const handleSubmit = () => {
    booksRefetch({
      variables: { title: `%${keyword}%` },
    });
  };

  if (booksLoading)
    return (
      <div className={classes.root}>
        <Loading />
      </div>
    );
  else if (booksError)
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
        <form onSubmit={handleSubmit}>
          <TextField
            label='Title'
            name='title'
            type='text'
            value={keyword}
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
        </form>
        <br />
        {searchData?.map((book) => {
          return <BookCard book={book} key={book.id} />;
        })}
      </main>
    );
  }
}
