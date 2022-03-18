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
import * as Yup from 'yup';

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
  const [pageAlert, setPageAlert] = useState({
    status: false,
    message: '',
  });
  const initialValues = {
    title: {
      initialValue: '',
      validation: 'string',
    },
    isbn: {
      initialValue: '',
      validation: 'string',
    },
    image: {
      initialValue: '',
      validation: 'string',
    },
    author: {
      initialValue: '',
      validation: 'string',
    },
    genre: {
      initialValue: '',
      validation: 'string',
    },
  };
  const reviewSchema = Yup.object().shape({
    isbn: Yup.string()
      .matches(/^978[0-9]{10}$/, 'ISBN must be 13 digits')
      .transform((value, originalValue) => {
        setIsbn(originalValue);
        setBook({
          ...book,
          isbn: originalValue,
        });
        return originalValue;
      })
      .required('ISBN is required'),
    // summary: Yup.string()
    //   .matches(
    //     /^[a-zA-Z0-9\.\'\"\-\,\`\‘\’\?\! ]{20,500}$/,
    //     'Summary must be alphanumeric and between 20 to 500 characters',
    //   )
    //   .transform((value, originalValue) => {
    //     setNewReview({ ...newReview, summary: originalValue });
    //     return originalValue;
    //   })
    //   .required('Summary is required'),
  });

  const {
    data: getByISBNData,
    loading: getByISBNLoading,
    error: getByISBNError,
  } = useQuery(GET_BOOK_BY_ISBN, { variables: { isbn } });
  // } = useQuery(GET_BOOK_BY_ISBN, { variables: { isbn: "9786020649351" } });

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

  // useEffect(() => {
  //   if (book?.id === undefined) router.push('/review/choose-book');
  // }, [book]);

  const handleSubmit = () => {
    postBook({
      variables: {
        data: {
          title: book.title,
          isbn: book.isbn,
          image: book.image,
          author: book.author,
          genre: book.genre,
        },
      },
    });
    setBook({
      title: '',
      isbn: '',
      image: '',
      author: '',
      genre: '',
    });
    router.push('/account');
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
    console.log("getByISBNError", getByISBNError);
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

          <FForm
            onSubmit={handleSubmit}
            initialValues={initialValues}
            style={{ width: '100%' }}
            validationSchema={reviewSchema}
          >
            <FTextField
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
            />
            <br /> <br />
            <FTextField
              name='title'
              type='text'
              label='Title'
              muiInputProps={{
                TextFieldProps: {
                  id: 'outlined-basic',
                  variant: 'outlined',
                  multiline: true,
                  fullWidth: true,
                },
              }}
              value={book.isbn}
              errorMessage='Title must not be empty'
            />
            <br /> <br />
            <FTextField
              name='image'
              type='text'
              label='Image'
              muiInputProps={{
                TextFieldProps: {
                  id: 'outlined-basic',
                  variant: 'outlined',
                  multiline: true,
                  fullWidth: true,
                },
              }}
              errorMessage='Image must not be empty'
            />
            <br /> <br />
            <FTextField
              name='author'
              type='text'
              label='Author'
              muiInputProps={{
                TextFieldProps: {
                  id: 'outlined-basic',
                  variant: 'outlined',
                  multiline: true,
                  fullWidth: true,
                },
              }}
              errorMessage='Author must not be empty'
            />
            <br /> <br />
            <p style={{ fontSize: '10px', marginTop: 0, marginBottom: '5px' }}>Please separate Genre by comma sign</p>
            <FTextField
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
            />
            {!pageAlert.status ? (
              <Button
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
              </Button>
            ) : getByISBNLoading ? (
              // <Loading />
              // <LoadingButton loading variant="outlined">
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
          </FForm>
          <br />
        </main>
      </>
    );
  }
}
