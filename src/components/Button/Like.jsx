import { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_REVIEW_LIKE_BY_REVIEW_ID_AND_USER_ID,
  POST_REVIEW_LIKE,
  DELETE_REVIEW_LIKE,
} from '../../libs/GraphQL/query';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 0,
    // margin: 0,
    backgroundColor: '#6200ee',
    // boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '10px',
    width: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  likeButton: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginRight: '0.5rem',
    maxWidth: '1.5rem',
    padding: '0.5rem',
    // '&:hover': {
    //   backgroundColor: '#ff5a5f',
    // },
  },
}));

export default function Like({ liked, onClick, likeCount, reviewId, userId }) {
  const classes = useStyles();
  const [likedState, setLikedState] = useState(false);
  const [likeCountState, setLikeCountState] = useState(parseInt(likeCount));

  const {
    data: likeData,
    loading: likeLoading,
    error: likeError,
  } = useQuery(GET_REVIEW_LIKE_BY_REVIEW_ID_AND_USER_ID, {
    variables: { reviewId, userId },
  });
  console.log('reviewId', reviewId);
  console.log('userId', userId);
  console.log('likeData', likeData);
  const [postLike, { loading: postLikeLoading, error: postLikeError }] = useMutation(POST_REVIEW_LIKE, {
    variables: {
      data: { reviewId, userId },
    },
    refetchQueries: [
      {
        query: GET_REVIEW_LIKE_BY_REVIEW_ID_AND_USER_ID,
        variables: { reviewId, userId },
      },
    ],
  });
  const [deleteLike, { loading: deleteLikeLoading, error: deleteLikeError }] = useMutation(DELETE_REVIEW_LIKE, {
    variables: {
      id: parseInt(likeData?.spill_review_like[0]?.id),
    },
    refetchQueries: [
      {
        query: GET_REVIEW_LIKE_BY_REVIEW_ID_AND_USER_ID,
        variables: { reviewId, userId },
      },
    ],
  });

  useEffect(() => {
    if (likeData?.spill_review_like[0]) {
      setLikedState(true);
      // setLikeCountState(likeData?.spill_review_like[0]?.count);
    }
  }, [likeData]);

  const handleClick = () => {
    setLikedState(!likedState);
    setLikeCountState(likeCountState + (likedState ? -1 : 1));
    onClick(likeCountState + (likedState ? -1 : 1));
    if (likeData?.spill_review_like[0]) {
      // if (likedState) {
      deleteLike();
    } else {
      postLike();
    }
    // }
  };

  return (
    <Button
      className={classes.root}
      onClick={handleClick}
      variant='contained'
      color='primary'
      startIcon={likedState ? <Favorite /> : <FavoriteBorder />}
    >
      {/* <i className={classes.likeButton}>{likedState ? <Favorite /> : <FavoriteBorder />}</i> */}
      {likeCountState}
    </Button>
  );
}
