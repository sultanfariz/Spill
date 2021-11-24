import { makeStyles } from '@mui/styles';
import Image from 'next/image';
import { Button, Divider, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { signIn, useSession, signOut } from 'next-auth/client';
import { useQuery, useMutation } from '@apollo/client';
import { GET_REVIEWER_BY_EMAIL, POST_REVIEWER } from '../../src/libs/GraphQL/query';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.primary,
    marginTop: '45px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    margin: '5px auto',
  },
  roundedImage: {
    width: '125px',
    height: '125px',
    borderRadius: '50%',
  },
  horizontalLine: {
    height: 0,
    width: '100%',
    border: '1px solid #909090',
    margin: '30px 0',
  },
}));

export function auth() {
  signIn('google', { callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/` });
}

export default function Profile() {
  const classes = useStyles();
  const [session, loading] = useSession();
  const [newReviewer, setNewReviewer] = useState({
    email: '',
    fullname: '',
  });
  const [email, setEmail] = useState(session ? session.user.email : '');
  const [reviewerData, setReviewerData] = useState();

  const {
    data: getByEmailData,
    loading: getByEmailLoading,
    error: getByEmailError,
    refetch: getByEmailRefetch,
  } = useQuery(GET_REVIEWER_BY_EMAIL, { variables: { email } });
  const [postReviewer, { loading: postReviewerLoading, error: postReviewerError }] = useMutation(POST_REVIEWER, {
    refetchQueries: [{ query: GET_REVIEWER_BY_EMAIL, variables: { email } }],
  });

  console.log('session', session);
  // console.log('email', email);
  console.log('getByEmailData', getByEmailData);
  console.log('setNewReviewer', newReviewer);

  useEffect(() => {
    setEmail(session ? session.user?.email : '');
    getByEmailRefetch();
  }, [session]);

  useEffect(() => {
    getByEmailRefetch();
  }, [email]);

  useEffect(() => {
    if (!getByEmailData?.spill_reviewer?.length) {
      setNewReviewer({
        email: session?.user?.email,
        fullname: session?.user?.name,
      });
      setReviewerData();
    }
  }, [getByEmailData]);

  useEffect(() => {
    if (newReviewer.email && newReviewer.fullname) {
      postReviewer({ variables: { data: newReviewer } });
      setNewReviewer({
        email: '',
        fullname: '',
      });
    }
  }, [newReviewer]);

  if (!session) {
    return (
      <div className={classes.container}>
        <h2>Login as reviewer</h2>
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            signIn('google', {
              callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
            });
            setEmail(session?.user?.email);
            getByEmailRefetch();
          }}
        >
          Login with Google
        </Button>
      </div>
    );
  } else
    return (
      <div className={classes.root}>
        <Image
          className={classes.roundedImage}
          src={session?.user?.image}
          width={125}
          height={125}
          alt={session?.user?.name}
        />
        <h2 style={{ marginBottom: '5px' }}>{session?.user?.name}</h2>
        <p className={classes.text}>{session?.user?.email}</p>
        <Button style={{ marginTop: '15px' }} variant='contained' color='primary' onClick={() => signOut()}>
          Sign out
        </Button>
        <div className={classes.horizontalLine}></div>
        {/* <Divider /> */}
        {
          getByEmailLoading ? (
            <div>Loading...</div>
          ) : getByEmailError ? (
            <div>Error</div>
          ) :
            getByEmailData?.spill_reviewer[0]?.reviews?.map((review) => {
              console.log('review', review);
              return (
                <Card key={review.id}>
                  <CardActionArea>
                    <CardMedia
                      component='img'
                      alt={review.book.title}
                      height='140'
                      image={review.book.image}
                      title={review.book.title}
                    />
                    <CardContent>
                      <h3>{review.book.title}</h3>
                      <p>{review.summary}</p>
                    </CardContent>
                  </CardActionArea>
                </Card>
              )
            })
        }
      </div>
    );
}
