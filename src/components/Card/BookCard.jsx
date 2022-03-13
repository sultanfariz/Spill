import { Box, Card, CardContent, CardMedia, CardActionArea, Typography } from '@mui/material';
import { useRouter } from 'next/router';

export default function BookCard({ book }) {
  // const publishedDate = new Date(book.publishedDate).toDateString();
  // const router = useRouter();

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
          // onClick={() => {
          //   router.push(`/book/${book.id}`);
          // }}
        >
          <CardMedia
            component='img'
            alt={book?.title}
            sx={{
              // maxWidth: '130px',
              // maxHeight: '151px',
              maxWidth: '10%',
              height: '100%',
              marginBottom: 0,
            }}
            image={book?.image}
            title={book?.title}
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
                <b>{book?.title}</b>
              </Typography>
              <p style={{ margin: '0 auto', fontSize: '11px' }}>by {book?.author}</p>
              <p style={{ textAlign: 'justify' }}>ISBN: {book?.isbn}</p>
              {/* <p style={{ margin: '0 auto', fontSize: '11px' }}>Published at {publishedDate}</p> */}
              {/* <Typography component='div' variant='caption' align='justify'>
                {book.summary}
              </Typography> */}
            </CardContent>
          </Box>
        </CardActionArea>
      </Box>
    </Card>
  );
}
