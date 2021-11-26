import Image from 'next/image';
import { useSession, getSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { makeStyles } from '@mui/styles';
import { useQuery } from '@apollo/client';
import styles from '../../styles/Home.module.css';
import Loading from '../../src/components/Page/Loading';
import ReviewCard from '../../src/components/Card/ReviewCard';
import { GET_REVIEWS_BY_TITLE_OR_AUTHOR } from '../../src/libs/GraphQL/query';

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

  // if (keyword === undefined) {
  //   router.push('/');
  // }

  const { data: searchData, loading: searchLoading, error: searchError } = useQuery(GET_REVIEWS_BY_TITLE_OR_AUTHOR, {
    variables: { keyword: `%${keyword}%` },
  });

  if (searchLoading)
    return (
      <div className={classes.root}>
        <Loading />
      </div>
    );
  else if (searchError)
    return (
      <div className={classes.root}>
        <h1>Error</h1>
        <p>{searchError.message}</p>
      </div>
    );
  else {
    return (
      <main className={styles.main}>
        {
          searchData?.spill_review?.map((review) => {
            return <ReviewCard review={review} key={review.id} />;
          })
        }
      </main>
    )
  }
}
