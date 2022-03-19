import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { makeStyles } from '@mui/styles';
import { Box, Button, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useQuery, useMutation } from '@apollo/client';
import styles from '../../styles/Home.module.css';
import Loading from '../../src/components/Page/Loading';
import Error from '../../src/components/Page/Error';
import { GET_BOOK_BY_ISBN, POST_BOOK } from '../../src/libs/GraphQL/query';
import { urlValidation, isbnValidation } from '../../src/utils/validation';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '100%',
  },
  horizontalLine: {
    height: 0,
    width: '100%',
    border: '1px solid #909090',
    margin: '30px 0',
  },
  button: {
    marginTop: '20px',
    marginBottom: '10px',
    width: '100%',
  },
}));

export default function InsertBook() {
  const classes = useStyles();
  const router = useRouter();
  const [session, loading] = useSession();
  const [isbn, setIsbn] = useState('');
  const [book, setBook] = useState({
    id: '',
    isbn: '',
    title: '',
    image: '',
    author: '',
    genre: '',
  });
  const [error, setError] = useState({
    isbn: {
      status: false,
      message: '',
    },
    title: {
      status: false,
      message: '',
    },
    image: {
      status: false,
      message: '',
    },
    author: {
      status: false,
      message: '',
    },
    genre: {
      status: false,
      message: '',
    },
  });
  const [pageAlert, setPageAlert] = useState({
    status: false,
    message: '',
  });

  const {
    data: getByISBNData,
    loading: getByISBNLoading,
    error: getByISBNError,
  } = useQuery(GET_BOOK_BY_ISBN, { variables: { isbn } });

  const [postBook, { loading: postBookLoading, error: postBookError }] = useMutation(POST_BOOK, {
    variables: { data: book },
  });

  useEffect(() => {
    if (getByISBNData?.spill_book?.length && isbn) {
      setPageAlert({
        status: true,
        message: `The book with ISBN: ${isbn} is already inserted.`,
      });
    } else {
      setPageAlert({
        status: false,
        message: '',
      });
    }
  }, [getByISBNData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const postBookData = {
      title: book.title,
      isbn: book.isbn,
      image: book.image,
      author: book.author,
      genre: `{${book.genre}}`,
    };
    // check if error is null
    if (
      !error.isbn.status &&
      !error.title.status &&
      !error.image.status &&
      !error.author.status &&
      !error.genre.status
    ) {
      postBook({ variables: { data: postBookData } });
      setBook({
        title: '',
        isbn: '',
        image: '',
        author: '',
        genre: '',
      });
    }
    router.push('/review/choose-book');
  };

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'isbn':
        setIsbn(e.target.value);
        setBook({ ...book, isbn: e.target.value });
        isbnValidation(e.target.value)
          ? setError({ ...error, isbn: { status: false, message: '' } })
          : setError({
              ...error,
              isbn: {
                status: true,
                message: 'ISBN must be 13 digits number and start with 978',
              },
            });
        break;
      case 'title':
        setBook({ ...book, title: e.target.value });
        e.target.value.length > 0
          ? setError({ ...error, title: { status: false, message: '' } })
          : setError({
              ...error,
              title: {
                status: true,
                message: 'Title is required',
              },
            });
        break;
      case 'image':
        setBook({ ...book, image: e.target.value });
        urlValidation(e.target.value)
          ? setError({ ...error, image: { status: false, message: '' } })
          : setError({
              ...error,
              image: {
                status: true,
                message: 'Image must be a valid URL',
              },
            });
        break;
      case 'author':
        setBook({ ...book, author: e.target.value });
        e.target.value.length > 0
          ? setError({ ...error, author: { status: false, message: '' } })
          : setError({
              ...error,
              title: {
                status: true,
                message: 'Author is required',
              },
            });
        break;
      case 'genre':
        setBook({ ...book, genre: e.target.value });
        e.target.value.length > 0
          ? setError({ ...error, genre: { status: false, message: '' } })
          : setError({
              ...error,
              title: {
                status: true,
                message: 'Genre is required',
              },
            });
        break;
    }
  };

  if (loading || postBookLoading) {
    return (
      <>
        <Loading />
      </>
    );
  } else if (!session?.user?.email) {
    router.push('/forbidden');
    return <></>;
  } else if (postBookError || getByISBNError) {
    return (
      <>
        <Error />
      </>
    );
  } else {
    return (
      <>
        <main className={styles.main}>
          <Typography variant='h6' align='center' color='textPrimary' gutterBottom sx={{ marginBottom: '10px' }}>
            Insert your review here
          </Typography>

          <Box component='form' className={classes.form} onSubmit={(e) => handleSubmit(e)}>
            <TextField
              name='isbn'
              type='text'
              label='ISBN'
              id='outlined-basic'
              variant='outlined'
              multiline
              fullWidth
              required
              onChange={(e) => handleChange(e)}
              error={error.isbn.status}
              helperText={error.isbn.message}
            />
            <br /> <br />
            <TextField
              name='title'
              type='text'
              label='Title'
              id='outlined-basic'
              variant='outlined'
              multiline
              fullWidth
              required
              onChange={(e) => handleChange(e)}
              error={error.title.status}
              helperText={error.title.message}
            />
            <br /> <br />
            <TextField
              name='image'
              type='text'
              label='Image'
              id='outlined-basic'
              variant='outlined'
              multiline
              fullWidth
              required
              onChange={(e) => handleChange(e)}
              error={error.image.status}
              helperText={error.image.message}
            />
            <br /> <br />
            <TextField
              name='author'
              type='text'
              label='Author'
              id='outlined-basic'
              variant='outlined'
              fullWidth
              required
              onChange={(e) => handleChange(e)}
              error={error.author.status}
              helperText={error.author.message}
            />
            <br />
            <p style={{ fontSize: '10px', marginTop: '5px', marginBottom: '5px' }}>
              Please separate Genre by comma sign
            </p>
            <TextField
              name='genre'
              type='text'
              label='Genre'
              id='outlined-basic'
              variant='outlined'
              multiline
              fullWidth
              required
              onChange={(e) => handleChange(e)}
              error={error.genre.status}
              helperText={error.genre.message}
            />
            {!pageAlert.status ? (
              <Button className={classes.button} variant='contained' color='primary' type='submit'>
                Submit
              </Button>
            ) : getByISBNLoading ? (
              <LoadingButton className={classes.button} loading variant='contained' fullWidth>
                Loading
              </LoadingButton>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Button className={classes.button} variant='contained' color='primary' type='submit' disabled>
                  Submit
                </Button>
                <Typography variant='caption' align='center' color='#b00020' gutterBottom sx={{ marginBottom: '10px' }}>
                  {pageAlert.message}
                </Typography>
              </div>
            )}
          </Box>
          <br />
        </main>
      </>
    );
  }
}
