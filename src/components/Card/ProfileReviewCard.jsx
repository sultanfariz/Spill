import { Box, Card, CardContent, CardMedia, CardActionArea, Typography } from '@mui/material';

export default function ProfileReviewCard({ review, key }) {
  return (
    <Card key={key} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
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
            alt={review.book.title}
            // height='140'
            // width='140'
            sx={{
              maxWidth: '130px',
              maxHeight: '151px',
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
              <p>{review.summary}</p>
            </CardContent>
          </Box>
        </CardActionArea>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '151px',
              padding: '0',
              paddingBottom: '0',
            }}
          >
            <CardActionArea
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: 'green',
                color: 'white',
                height: '50%',
                minHeight: '50%',
                textAlign: 'center',
                padding: '5px',
              }}
            >
              <p>Edit</p>
            </CardActionArea>
            <CardActionArea
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: 'red',
                color: 'white',
                height: '50%',
                minHeight: '50%',
                textAlign: 'center',
                padding: '5px',
              }}
            >
              <p>Remove</p>
            </CardActionArea>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
