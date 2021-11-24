import { makeStyles } from '@mui/styles';
import Image from 'next/image';
import { Box, Button, Divider, Card, CardContent, CardMedia, CardActionArea, IconButton, Typography } from '@mui/material';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { signIn, useSession, signOut } from 'next-auth/client';
import { useQuery, useMutation } from '@apollo/client';
import { GET_REVIEWER_BY_EMAIL, POST_REVIEWER } from '../../src/libs/GraphQL/query';
import Loading from '../../src/components/Page/Loading';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

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
        {getByEmailLoading ? (
          <Loading />
        ) : getByEmailError ? (
          <div>Error</div>
        ) : (
          getByEmailData?.spill_reviewer[0]?.reviews?.map((review) => {
            console.log('review', review);
            return (
              <>
                <Card key={review.id} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
                  <Box sx={{
                    display: 'flex', flexDirection: 'row', margin: '0', justifyContent: 'space-between', width: '100%',
                  }}>
                    <CardActionArea sx={{
                      display: 'flex', flexDirection: 'row', margin: '0', justifyContent: 'flex-start', width: '100%',
                    }}
                    >
                      <CardMedia
                        component='img'
                        alt={review.book.title}
                        // height='140'
                        // width='140'
                        sx={{ width: '151px', marginBottom: 0 }}
                        image={review.book.image}
                        title={review.book.title}
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                        <CardContent sx={{
                          padding: '5px 16px',
                        }}
                        >
                          <Typography component="div" variant="h5">
                            {review.book.title}
                          </Typography>
                          <p>{review.summary}</p>
                        </CardContent>
                      </Box>
                    </CardActionArea>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                      <Box sx={{
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        height: '151px',
                        padding: '0', paddingBottom: '0',
                      }}
                      >
                        <CardActionArea sx={{
                          display: 'flex', flexDirection: 'column', justifyContent: 'center',
                          backgroundColor: 'green', color: 'white', height: '50%',
                          minHeight: '50%',
                          textAlign: 'center', padding: '5px'
                        }}>
                          <p>Edit</p></CardActionArea>
                        <CardActionArea sx={{
                          display: 'flex', flexDirection: 'column', justifyContent: 'center',
                          backgroundColor: 'red', color: 'white', height: '50%',
                          minHeight: '50%',
                          textAlign: 'center', padding: '5px'
                        }}>
                          <p>Remove</p></CardActionArea>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </>
            );
          })
        )}
      </div>
    );
}
