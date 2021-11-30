import { useEffect } from 'react';
import { useSession, getSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { makeStyles } from '@mui/styles';
import { useQuery } from '@apollo/client';
import styles from '../styles/Home.module.css';
import Loading from '../src/components/Page/Loading';
import ReviewCard from '../src/components/Card/ReviewCard';
import { GET_ALL_REVIEWS } from '../src/libs/GraphQL/query';

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

  const { data: getAllData, loading: getAllLoading, error: getAllError, refetch: getAllRefetch } = useQuery(GET_ALL_REVIEWS);

  useEffect(() => {
    getAllRefetch();
  }, []);

  if (loading || getAllLoading)
    return (
      <div className={classes.root}>
        <Loading />
      </div>
    );
  else {
    return (
      <>
        <main className={styles.main}>
          <h2 className={styles.title}>
            Hi<span style={{ color: '#6200EE' }}> {session?.user?.name}</span>,
          </h2>
          <h1 className={styles.title} style={{ marginBottom: '40px' }}>
            Welcome to <span style={{ color: '#6200EE' }}>Spill!</span>
          </h1>

          {getAllData?.spill_review?.map((review) => {
            return <ReviewCard review={review} key={review.id} />;
          })}
        </main>
      </>
    );
  }
}

export async function getServerSideProps(ctx) {
  return {
    props: { session: await getSession(ctx) },
  };
}
