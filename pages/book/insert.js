import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { makeStyles } from '@mui/styles';
import { Button, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useQuery, useMutation } from '@apollo/client';
import { FButton, FForm, FTextField } from '@formulir/material-ui';
import styles from '../../styles/Home.module.css';
import Loading from '../../src/components/Page/Loading';
import Error from '../../src/components/Page/Error';
import { GET_BOOK_BY_ISBN, POST_BOOK } from '../../src/libs/GraphQL/query';
import { urlValidation, isbnValidation, } from '../../src/utils/validation';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalLine: {
    height: 0,
    width: '100%',
    border: '1px solid #909090',
    margin: '30px 0',
  },
}));

export default function InsertBook() {
  const classes = useStyles();
  const router = useRouter();
  // const isbn = router.query.isbn;
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
  // const initialValues = {
  //   title: {
  //     initialValue: '',
  //     validation: 'string',
  //   },
  //   isbn: {
  //     initialValue: '',
  //     validation: 'string',
  //   },
  //   image: {
  //     initialValue: '',
  //     validation: 'string',
  //   },
  //   author: {
  //     initialValue: '',
  //     validation: 'string',
  //   },
  //   genre: {
  //     initialValue: '',
  //     validation: 'string',
  //   },
  // };
  // const reviewSchema = Yup.object().shape({
  //   isbn: Yup.string()
  //     .matches(/^978[0-9]{10}$/, 'ISBN must be 13 digits')
  //     .transform((value, originalValue) => {
  //       setIsbn(originalValue);
  //       setBook({
  //         ...book,
  //         isbn: originalValue,
  //       });
  //       return originalValue;
  //     })
  //     .required('ISBN is required'),
  //   image: Yup.string()
  //     .matches(
  //       /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
  //       'Image must be a valid URL',
  //     )
  //     .transform((value, originalValue) => {
  //       console.log(originalValue);
  //       setBook({
  //         ...book,
  //         image: originalValue,
  //       });
  //       return originalValue;
  //     })
  //     .required('Image is required'),
  // });

  const {
    data: getByISBNData,
    loading: getByISBNLoading,
    error: getByISBNError,
  } = useQuery(GET_BOOK_BY_ISBN, { variables: { isbn } });

  const [postBook, { loading: postBookLoading, error: postBookError }] = useMutation(POST_BOOK, {
    variables: { data: book },
  });

  useEffect(() => {
    // if (getByISBNData) {
    if (getByISBNData?.spill_book?.length) {
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

  const handleSubmit = () => {
    const postBookData = {
      title: book.title,
      isbn: book.isbn,
      image: book.image,
      author: book.author,
      genre: `{${book.genre}}`,
    };
    postBook({
      variables: { data: postBookData },
    });
    console.log(book);
    setBook({
      title: '',
      isbn: '',
      image: '',
      author: '',
      genre: '',
    });
    // router.push('/account');
  };

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'isbn':
        setIsbn(e.target.value);
        isbnValidation(e.target.value)
          ? () => {
            setError({ ...error, isbn: { status: false, message: '' } })
            setData({ ...data, isbn: e.target.value });
          } : setError({
            ...error,
            isbn: {
              status: true,
              message: 'ISBN must be 13 digits number and start with 978',
            },
          });
        break;
      case 'title':
        e.target.value.length > 0
          ? () => {
            setError({ ...error, title: { status: false, message: '' } })
            setData({ ...data, title: e.target.value });
          } : setError({
            ...error,
            title: {
              status: true,
              message: 'Title is required',
            },
          });
        break;
      case 'image':
        urlValidation(e.target.value)
          ? () => {
            setError({ ...error, image: { status: false, message: '' } })
            setData({ ...data, image: e.target.value });
          } : setError({
            ...error,
            image: {
              status: true,
              message: 'Image must be a valid URL',
            },
          });
        break;
      case 'author':
        e.target.value.length > 0
          ? () => {
            setError({ ...error, author: { status: false, message: '' } })
            setData({ ...data, author: e.target.value });
          } : setError({
            ...error,
            title: {
              status: true,
              message: 'Author is required',
            },
          });
        break;
      case 'genre':
        e.target.value.length > 0
          ? () => {
            setError({ ...error, genre: { status: false, message: '' } })
            setData({ ...data, genre: e.target.value });
          } : setError({
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
    console.log('getByISBNError', getByISBNError);
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

          <form
            onSubmit={handleSubmit}
            // initialValues={initialValues}
            style={{ width: '100%' }}
          // validationSchema={reviewSchema}
          >
            {/* <FTextField
              name='isbn'
              type='text'
              label='ISBN'
              muiInputProps={{
                TextFieldProps: {
                  id: 'outlined-basic',
                  variant: 'outlined',
                  multiline: true,
                  fullWidth: true,
                },
              }}
              errorMessage='ISBN must be 13 digits'
            /> */}
            <TextField
              name='isbn'
              type='text'
              label='ISBN'
              id='outlined-basic'
              variant='outlined'
              multiline
              fullWidth
              required
              onChange={(e) => handleOnChange(e)}
              error={error.isbn.status}
              helperText={error.isbn.message}
            // errorMessage='ISBN must be 13 digits'
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
              onChange={(e) => handleOnChange(e)}
              error={error.title.status}
              helperText={error.title.message}
            // errorMessage='Title must not be empty'
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
              onChange={(e) => handleOnChange(e)}
              error={error.image.status}
              helperText={error.image.message}
            // errorMessage='Image must not be empty'
            />
            <br /> <br />
            <TextField
              name='author'
              type='text'
              label='Author'
              id='outlined-basic'
              variant='outlined'
              multiline
              fullWidth
              required
              onChange={(e) => handleOnChange(e)}
              error={error.author.status}
              helperText={error.author.message}
            // errorMessage='Author must not be empty'
            />
            <br />
            <p style={{ fontSize: '10px', marginTop: '5px', marginBottom: '5px' }}>Please separate Genre by comma sign</p>
            {/* <FTextField
              name='genre'
              type='text'
              label='Genre'
              muiInputProps={{
                TextFieldProps: {
                  id: 'outlined-basic',
                  variant: 'outlined',
                  multiline: true,
                  fullWidth: true,
                  helperText: 'Please separate Genre by comma sign',
                },
              }}
              helperText='Please separate Genre by comma sign'
              errorMessage='Genre must not be empty'
            /> */}
            <TextField
              name='genre'
              type='text'
              label='Genre'
              id='outlined-basic'
              variant='outlined'
              multiline
              fullWidth
              required
              onChange={(e) => handleOnChange(e)}
              error={error.genre.status}
              helperText={error.genre.message}
            // helperText='Please separate Genre by comma sign'
            />
            {!pageAlert.status ? (
              <Button
                style={{
                  marginTop: '20px',
                  width: '100%',
                }}
                // onClick={handleSubmit}
                variant='contained'
                color='primary'
                type='submit'
              >
                Submit
              </Button>
            ) : getByISBNLoading ? (
              // <Loading />
              <LoadingButton
                style={{
                  marginTop: '20px',
                  marginBottom: '10px',
                  width: '100%',
                }}
                loading
                variant='contained'
                fullWidth
              >
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
                <Button
                  style={{
                    marginTop: '20px',
                    marginBottom: '10px',
                    width: '100%',
                  }}
                  variant='contained'
                  color='primary'
                  type='submit'
                  disabled
                >
                  Submit
                </Button>
                <Typography variant='caption' align='center' color='#b00020' gutterBottom sx={{ marginBottom: '10px' }}>
                  {/* {`Sorry we couldn't find the book you are looking for.`} */}
                  {pageAlert.message}
                </Typography>
              </div>
            )}
            {/* <Button
              style={{
                marginTop: '20px',
                width: '100%',
              }}
              onClick={handleSubmit}
              variant='contained'
              color='primary'
              type='submit'
            >
              Submit
            </Button> */}
          </form>
          <br />
        </main>
      </>
    );
  }
}
