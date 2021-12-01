import Image from 'next/image';
import { useRouter } from 'next/router';
import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import Loading from '../../src/components/Page/Loading';
import NotFound from '../../src/components/Page/NotFound';
import Error from '../../src/components/Page/Error';
import { GET_REVIEW_BY_ID } from '../../src/libs/GraphQL/query';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'row',
  },
  textHeader: {
    backgroundColor: theme.palette.background.default,
    maxWidth: '70%',
    marginRight: '10px',
  },
  horizontalLine: {
    height: 0,
    width: '100%',
    border: '1px solid #909090',
    margin: '5px 0',
  },
  typography: {
    maxWidth: '90%',
  },
}));

export default function Detail() {
  const classes = useStyles();
  const router = useRouter();
  const bookId = router.query.id;

  const { data, loading, error } = useQuery(GET_REVIEW_BY_ID, { variables: { id: bookId } });
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
              {reviewData.book.author}
            </Typography>
            <br />
            <br />
            <Typography variant='body2' className={classes.typography} align='left' color='#4c4940' gutterBottom>
              <i>{`"${reviewData.summary}"`}</i>
            </Typography>
            <Typography variant='caption' className={classes.typography} align='left' color='#4c4940' gutterBottom>
              {`- ${reviewData.reviewer.fullname} (Reviewer)`}
            </Typography>
          </main>
          <div>
            <Image src={reviewData.book.image} width={150} height={225} alt={reviewData.book.title} />
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <div className={classes.horizontalLine} />
          <Typography variant='caption' style={{ margin: '0' }} align='left' color='#4c4940' gutterBottom>
            Published at <span style={{ color: 'black', fontWeight: 'bold' }}>{reviewData.publishedDate}</span>
          </Typography>
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
