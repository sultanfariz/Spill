import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@mui/styles';
import { useQuery } from '@apollo/client';
import styles from '../../styles/Home.module.css';
import Loading from '../../src/components/Page/Loading';
import NotFoundPage from '../../src/components/Page/NotFound';
import ErrorPage from '../../src/components/Page/Error';
import ReviewCard from '../../src/components/Card/ReviewCard';
import NavTabs from '../../src/components/Button/SearchFilterTab';
import {
  GET_REVIEWS_BY_TITLE_OR_AUTHOR,
  GET_REVIEWS_BY_TITLE_OR_AUTHOR_ORDER_BY_NEWEST,
} from '../../src/libs/GraphQL/query';

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

export default function Search() {
  const classes = useStyles();
  const router = useRouter();
  const keyword = router.query.keyword;
  const order = router.query.order;
  const [orderBy, setOrderBy] = useState(order);
  const [searchData, setSearchData] = useState([]);
  const [tab, setTab] = useState(0);

  const {
    data: popularityData,
    loading: popularityLoading,
    error: popularityError,
    refetch: popularityRefetch,
  } = useQuery(GET_REVIEWS_BY_TITLE_OR_AUTHOR, {
    variables: { keyword: `%${keyword}%` },
  });

  const {
    data: newestData,
    loading: newestLoading,
    error: newestError,
    refetch: newestRefetch,
  } = useQuery(GET_REVIEWS_BY_TITLE_OR_AUTHOR_ORDER_BY_NEWEST, {
    variables: { keyword: `%${keyword}%` },
  });

  useEffect(() => {
    if (order === 'newest') {
      setOrderBy('newest');
      setTab(1);
    } else if (order === 'popularity' || order === undefined) {
      setOrderBy('popularity');
      setTab(0);
    }
  }, [order]);

  useEffect(() => {
    if (orderBy === 'newest') {
      newestRefetch();
      setSearchData(newestData?.spill_review);
    } else if (orderBy === 'popularity') {
      popularityRefetch();
      setSearchData(popularityData?.spill_review);
    }
  }, [orderBy]);

  useEffect(() => {
    if (newestData) {
      setSearchData(newestData.spill_review);
    }
  }, [newestData]);

  useEffect(() => {
    if (popularityData) {
      setSearchData(popularityData.spill_review);
      // setTab(1);
    }
  }, [popularityData]);

  // useEffect(() => {

  // }, []);

  if (popularityLoading || newestLoading)
    return (
      <div className={classes.root}>
        <Loading />
      </div>
    );
  else if (keyword === undefined) {
    router.push('/');
    return <></>;
  } else if (popularityData?.spill_review?.length === 0) {
    return (
      <div className={classes.root}>
        <NotFoundPage />
      </div>
    );
  } else if (popularityError || newestError)
    return (
      <div className={classes.root}>
        <ErrorPage />
      </div>
    );
  else {
    return (
      // <main className={styles.main}>
      <main>
        <NavTabs keyword={keyword} tab={tab} />
        {searchData?.map((review) => {
          return <ReviewCard review={review} key={review.id} />;
        })}
      </main>
    );
  }
}
