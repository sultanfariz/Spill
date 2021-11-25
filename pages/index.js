import Image from 'next/image';
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
  console.log('session', session);

  const { data: getAllData, loading: getAllLoading, error: getAllError } = useQuery(GET_ALL_REVIEWS);
  console.log('getAllData', getAllData);

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
          <h1
            className={styles.title}
            style={{
              marginBottom: '40px',
            }}
          >
            Welcome to <span style={{ color: '#6200EE' }}>Spill!</span>
          </h1>

          {/* <p className={styles.description}>
            Get started by editing <code className={styles.code}>pages/index.js</code>
          </p> */}

          {getAllData?.spill_review?.map((review) => {
            return (
              <>
                <ReviewCard review={review} id={review.id} key={review.id} />
              </>
            );
          })}
        </main>

        <footer className={styles.footer}>
          <a
            href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
            </span>
          </a>
        </footer>
      </>
    );
  }
}

export async function getServerSideProps(ctx) {
  return {
    props: { session: await getSession(ctx) },
  };
}
