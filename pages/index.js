import Image from 'next/image';
import { useSession, getSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { makeStyles } from '@mui/styles';
import { useQuery } from '@apollo/client';
import styles from '../styles/Home.module.css';
import Loading from '../src/components/Page/Loading';
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

  if (loading) return <Loading />;
  else {
    return (
      <>
        <main className={styles.main}>
          <h2 className={styles.title}>
            Hi <span style={{ color: '#6200EE' }}>{session?.user?.name},</span>
          </h2>
          <h1 className={styles.title}>
            Welcome to <span style={{ color: '#6200EE' }}>Spill!</span>
          </h1>

          <p className={styles.description}>
            Get started by editing <code className={styles.code}>pages/index.js</code>
          </p>

          <div className={styles.grid}>
            {getAllData?.getAllReviews?.map((review) => (
              <div className={styles.card} key={review.id}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderText}>
                    <h3>{review.title}</h3>
                    <p>{review.description}</p>
                  </div>
                  <div className={styles.cardHeaderImage}>
                    <Image
                      src={review.image}
                      alt={review.title}
                      width={100}
                      height={100}
                      layout='fill'
                      className={styles.cardImage}
                    />
                  </div>
                </div>
              </div>
            ))}
            <a href='https://nextjs.org/docs' className={styles.card}>
              <h2>Documentation &rarr;</h2>
              <p>Find in-depth information about Next.js features and API.</p>
            </a>
          </div>
          {/* <div className={styles.grid}>
            <a href='https://nextjs.org/docs' className={styles.card}>
              <h2>Documentation &rarr;</h2>
              <p>Find in-depth information about Next.js features and API.</p>
            </a>

            <a href='https://nextjs.org/learn' className={styles.card}>
              <h2>Learn &rarr;</h2>
              <p>Learn about Next.js in an interactive course with quizzes!</p>
            </a>

            <a href='https://github.com/vercel/next.js/tree/master/examples' className={styles.card}>
              <h2>Examples &rarr;</h2>
              <p>Discover and deploy boilerplate example Next.js projects.</p>
            </a>

            <a
              href='https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
              className={styles.card}
            >
              <h2>Deploy &rarr;</h2>
              <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
            </a>
          </div> */}
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
