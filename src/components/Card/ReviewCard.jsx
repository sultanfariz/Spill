import { Box, Card, CardContent, CardMedia, CardActionArea, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
}));

export default function ReviewCard({ review }) {
  const classes = useStyles();
  const publishedDate = new Date(review.publishedDate).toDateString();
  // {
  //   () => {
  //     const date = new Date(review?.publishedDate);
  //     console.log('date', date.toDateString());
  //     return date.toDateString();
  //   };
  // }

  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
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
        >
          <CardMedia
            component='img'
            alt={review?.book?.title}
            // height='140'
            // width='140'
            sx={{
              maxWidth: '130px',
              maxHeight: '151px',
              marginBottom: 0,
            }}
            image={review?.book?.image}
            title={review?.book?.title}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <CardContent sx={{ padding: '5px 16px' }}>
              <Typography component='div' variant='h6'>
                <b>{review?.book?.title}</b>
              </Typography>
              <p style={{ margin: '0 auto', fontSize: '11px' }}>by {review?.reviewer?.fullname}</p>
              <p style={{ margin: '0 auto', fontSize: '11px' }}>Published at {publishedDate}</p>
              <p>{review?.summary}</p>
            </CardContent>
          </Box>
        </CardActionArea>
      </Box>
    </Card>
  );
}
