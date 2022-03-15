import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { makeStyles } from '@mui/styles';
import { Box, IconButton, Typography } from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import ShareIcon from '@mui/icons-material/Share';
import Loading from '../../src/components/Page/Loading';
import NotFound from '../../src/components/Page/NotFound';
import Error from '../../src/components/Page/Error';
import {
  GET_REVIEW_BY_ID,
  GET_REVIEWER_BY_EMAIL,
  UPDATE_REVIEW,
  GET_REVIEW_LIKE_BY_REVIEW_ID_AND_USER_ID,
} from '../../src/libs/GraphQL/query';
import Like from '../../src/components/Button/Like';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textHeader: {
    backgroundColor: theme.palette.background.default,
    maxWidth: '60%',
    marginRight: '10px',
  },
  horizontalLine: {
    height: 0,
    width: '100%',
    border: '1px solid #909090',
    margin: '5px 0',
  },
  shareButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  typography: {
    maxWidth: '90%',
  },
}));

export default function Detail() {
  const classes = useStyles();
  const router = useRouter();
  // const ref = 
  const [session, sessionLoading] = useSession();
  const bookId = router.query.id;
  const [updatedReview, setUpdatedReview] = useState({
    bookId: '',
    reviewerId: '',
    summary: '',
  });

  const { data, loading, error, refetch } = useQuery(GET_REVIEW_BY_ID, { variables: { id: bookId } });
  const {
    data: reviewerData,
    loading: reviewerLoading,
    error: reviewerError,
  } = useQuery(GET_REVIEWER_BY_EMAIL, {
    variables: { email: session?.user?.email },
  });
  const [updateReview, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_REVIEW);
  // const { data: likeData, loading: likeLoading, error: likeError } = useQuery(GET_REVIEW_LIKE_BY_REVIEW_ID_AND_USER_ID, {
  //   variables: {
  //     reviewId: parseInt(router.query.id),
  //     userId: parseInt(reviewerData?.spill_reviewer[0]?.id),
  //   }
  // });

  const reviewData = {
    id: data?.spill_review_by_pk?.id,
    book: {
      title: data?.spill_review_by_pk?.book?.title,
      author: data?.spill_review_by_pk?.book?.author,
      image: data?.spill_review_by_pk?.book?.image,
    },
    reviewer: {
      fullname: data?.spill_review_by_pk?.reviewer?.fullname,
      image: data?.spill_review_by_pk?.reviewer?.image,
    },
    summary: data?.spill_review_by_pk?.summary,
    publishedDate: new Date(data?.spill_review_by_pk?.publishedDate).toDateString(),
    reviewSections: data?.spill_review_by_pk?.review_sections,
    likeCount: data?.spill_review_by_pk?.likeCount,
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data) {
      setUpdatedReview({
        ...updatedReview,
        bookId: data?.spill_review_by_pk?.book?.id,
        reviewerId: data.spill_review_by_pk?.reviewer?.id,
        summary: data.spill_review_by_pk?.summary,
        review_sections: data.spill_review_by_pk?.review_sections,
        publishedDate: data.spill_review_by_pk?.publishedDate,
        likeCount: data.spill_review_by_pk?.likeCount,
      });
    }
  }, [data]);

  const copyToClipboard = () => {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    alert("Copied to clipboard!");
  }

  const handleClick = (likeCount) => {
    const hey = {
      id: parseInt(router.query.id),
      data: {
        bookId: parseInt(updatedReview.bookId),
        reviewerId: parseInt(updatedReview.reviewerId),
        summary: updatedReview.summary,
        publishedDate: updatedReview.publishedDate,
        likeCount: parseInt(likeCount),
      },
    };
    console.log('hey', hey);
    updateReview({
      variables: {
        id: parseInt(router.query.id),
        data: {
          bookId: parseInt(updatedReview.bookId),
          reviewerId: parseInt(updatedReview.reviewerId),
          summary: updatedReview.summary,
          publishedDate: updatedReview.publishedDate,
          likeCount: parseInt(likeCount),
        },
      },
    });

    setUpdatedReview({
      bookId: '',
      reviewerId: '',
      summary: '',
      likeCount: 0,
      publishedDate: '',
    });
  };

  if (loading) return <Loading />;
  else if (error) return <Error />;
  else if (reviewData.id === undefined) return <NotFound />;
  else
    return (
      <>
        <div className={classes.root}>
          <main className={classes.textHeader}>
            <Typography variant='h5' className={classes.typography} align='left' color='#6200ee' gutterBottom>
              {reviewData.book.title}
            </Typography>
            <Typography variant='caption' className={classes.typography} align='left' color='#4c4940' gutterBottom>
              <b>{reviewData.book.author}</b>
            </Typography>
            <br />
            <br />
            <Typography variant='body2' className={classes.typography} align='left' color='#4c4940' gutterBottom>
              <i>{`"${reviewData.summary}"`}</i>
            </Typography>
            <Typography variant='caption' className={classes.typography} align='left' color='#4c4940' gutterBottom>
              {`- ${reviewData.reviewer.fullname} `}
              <i>{` (Reviewer)`}</i>
            </Typography>
          </main>
          <div>
            <Image src={reviewData.book.image} width={150} height={225} alt={reviewData.book.title} />
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <div className={classes.horizontalLine} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              // marginTop: '10px',
              // marginBottom: '10px',
            }}
          >
            <Typography variant='caption' style={{ margin: '0' }} align='left' color='#4c4940' gutterBottom>
              Published at <span style={{ color: 'black', fontWeight: 'bold' }}>{reviewData.publishedDate}</span>
            </Typography>
            <Box className={classes.shareButton}>
              {session ? (
                <Like
                  likeCount={reviewData.likeCount}
                  onClick={handleClick}
                  reviewId={reviewData.id}
                  userId={reviewerData?.spill_reviewer[0]?.id}
                />
              ) : (
                <></>
              )}
              <IconButton aria-label="delete" size="large"
                onClick={copyToClipboard}
              ><ShareIcon /></IconButton>
            </Box>
            {/* <Like likeCount={reviewData.likeCount} onClick={handleClick}
                reviewId={reviewData.id}
                userId={reviewerData?.spill_reviewer[0]?.id}
              /> */}
            {/* <Like likeCount="0" /> */}
          </div>
          <div className={classes.horizontalLine} />
        </div>
        <br />
        {reviewData.reviewSections.map((section) => (
          <>
            <Typography variant='h6' align='left' color='#6200ee' gutterBottom>
              {section.heading}
            </Typography>
            <Typography variant='body2' align='justify' color='#4c4940' gutterBottom>
              {section.body}
            </Typography>
            <br />
          </>
        ))}
      </>
    );
}
