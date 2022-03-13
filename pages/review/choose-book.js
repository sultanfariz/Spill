import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@mui/styles';
import { useQuery } from '@apollo/client';
import styles from '../../styles/Home.module.css';
import Loading from '../../src/components/Page/Loading';
import NotFoundPage from '../../src/components/Page/NotFound';
import ErrorPage from '../../src/components/Page/Error';
import BookCard from '../../src/components/Card/BookCard';
import { GET_ALL_BOOKS } from '../../src/libs/GraphQL/query';

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
  const keyword = router.query.keyword;
  const [searchData, setSearchData] = useState([]);

  const {
    data: booksData,
    loading: booksLoading,
    error: booksError,
    refetch: booksRefetch,
  } = useQuery(GET_ALL_BOOKS, {
    variables: { keyword: `%${keyword}%` },
  });

  useEffect(() => {
    if (booksData) {
      console.log(booksData);
      setSearchData(booksData.spill_book);
      // setTab(1);
    }
  }, [booksData]);

  // useEffect(() => {

  // }, []);

  if (booksLoading || newestLoading)
    return (
      <div className={classes.root}>
        <Loading />
      </div>
    );
  // else if (keyword === undefined) {
  // router.push('/');
  // return <></>;
  // } else if (booksData?.spill_review?.length === 0) {
  else if (booksData?.spill_review?.length === 0) {
    return (
      <div className={classes.root}>
        <NotFoundPage />
      </div>
    );
  } else if (booksError || newestError)
    return (
      <div className={classes.root}>
        <ErrorPage />
      </div>
    );
  else {
    return (
      // <main className={styles.main}>
      <main>
        {/* <NavTabs keyword={keyword} tab={tab} /> */}
        <br />
        {searchData?.map((book) => {
          return <BookCard book={book} key={book.id} />;
        })}
      </main>
    );
  }
}
