import { Box, Card, CardContent, CardMedia, CardActionArea, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: 'white',
    height: '50%',
    minHeight: '50%',
    textAlign: 'center',
    padding: '5px',
  },
}));

export default function AccountReviewCard({ review, id, removeCard }) {
  const classes = useStyles();
  const router = useRouter();

  return (
    <Card key={id} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          margin: '0',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <CardActionArea
          sx={{
            display: 'flex',
            flexDirection: 'row',
            margin: '0',
            justifyContent: 'flex-start',
            width: '100%',
          }}
          onClick={() => {
            router.push(`/review/${review.id}`);
          }}
        >
          <CardMedia
            component='img'
            alt={review.book.title}
            // height='140'
            // width='140'
            sx={{
              // width: '35%',
              maxWidth: '30%',
              height: '100%',
              marginBottom: 0,
            }}
            image={review.book.image}
            title={review.book.title}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <CardContent
              sx={{
                padding: '5px 16px',
              }}
            >
              <Typography component='div' variant='h6'>
                {review.book.title}
              </Typography>
              <Typography component='div' variant='caption' align='justify'>
                {review.summary}
              </Typography>
              {/* <p>{review.summary}</p> */}
            </CardContent>
          </Box>
        </CardActionArea>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              padding: '0',
              paddingBottom: '0',
            }}
          >
            <CardActionArea
              className={classes.actionButton}
              sx={{ backgroundColor: 'green' }}
              onClick={() => {
                router.push(`/review/${review.id}/update`);
              }}
            >
              <p>Edit</p>
            </CardActionArea>
            <CardActionArea
              className={classes.actionButton}
              onClick={() => removeCard(review.id)}
              sx={{ backgroundColor: 'red' }}
            >
              <p>Remove</p>
            </CardActionArea>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
