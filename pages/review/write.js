import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { makeStyles } from '@mui/styles';
import { TextField, Button, Grid, Typography, Container, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery, useMutation } from '@apollo/client';
import styles from '../../styles/Home.module.css';
import Loading from '../../src/components/Page/Loading';
import { FButton, FForm, FTextField } from '@formulir/material-ui';
import { GET_BOOK_BY_ISBN, GET_REVIEWER_BY_EMAIL, POST_REVIEW } from '../../src/libs/GraphQL/query';
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

export default function Write() {
  const classes = useStyles();
  const router = useRouter();
  const [session, loading] = useSession();
  const [isbn, setIsbn] = useState('');
  const [newReview, setNewReview] = useState({
    bookId: '',
    reviewerId: '',
    summary: '',
    review_sections: [],
  });

  const [fields, setFields] = useState({});
  const [fieldsValidation, setFieldsValidation] = useState({});
  const initialValues = {
    isbn: {
      initialValue: '',
      validation: 'string',
    },
    summary: {
      initialValue: '',
      validation: 'string',
    },
    // section: {
    ...fields,
    // },
  };

  const reviewSchema = Yup.object().shape({
    isbn: Yup.string()
      .matches(/^978[0-9]{10}$/, 'ISBN must be 13 digits')
      .transform((value, originalValue) => {
        console.log(reviewSchema);
        console.log(newReview);
        setIsbn(originalValue);
        return originalValue;
      })
      .required('ISBN is required'),
    summary: Yup.string()
      .matches(
        /^[a-zA-Z0-9\.\'\"\-\,\`\‘\’ ]{20,500}$/,
        'Summary must be alphanumeric and between 20 to 500 characters',
      )
      .transform((value, originalValue) => {
        setNewReview({ ...newReview, summary: originalValue });
        return originalValue;
      })
      .required('Summary is required'),
    ...fieldsValidation,
    // section: Yup.array().of(
    //   Yup.object().shape({
    //     heading: Yup.string()
    //       .matches(/^[a-zA-Z0-9 ]{1,50}$/, 'Heading must be alphanumeric and between 1 to 50 characters')
    //       .required('Heading is required'),
    //     body: Yup.string()
    //       .matches(/^[a-zA-Z0-9 ]{20,500}$/, 'Body must be alphanumeric and between 20 to 500 characters')
    //       .required('Body is required'),
    //   }),
    // ),
  });

  const {
    data: getByEmailData,
    loading: getByEmailLoading,
    error: getByEmailError,
  } = useQuery(GET_REVIEWER_BY_EMAIL, {
    variables: { email: session?.user?.email },
  });
  const {
    data: getByISBNData,
    loading: getByISBNLoading,
    error: getByISBNError,
  } = useQuery(GET_BOOK_BY_ISBN, { variables: { isbn } });
  const [postReview, { loading: postReviewLoading, error: postReviewError }] = useMutation(POST_REVIEW, {
    variables: { data: newReview },
  });

  useEffect(() => {
    if (getByEmailData) {
      setNewReview({
        ...newReview,
        reviewerId: getByEmailData?.spill_reviewer[0]?.id,
      });
    }
  }, [getByEmailData]);

  useEffect(() => {
    if (getByISBNData) {
      setNewReview({
        ...newReview,
        bookId: getByISBNData?.spill_book[0]?.id,
      });
    }
  }, [getByISBNData]);

  const handleAddFields = (e) => {
    e.preventDefault();
    const fieldKeys = Object.keys(fields);

    const newFields = {
      ...fields,
      [`${fieldKeys.length}`]: {
        initialValue: '',
        validation: 'string',
      },
    };

    // const newFieldsValidation = {
    //   ...fieldsValidation,
    //   [`heading${fieldKeys.length}`]: Yup.string()
    //     .matches(/^[a-zA-Z0-9\.\'\"\-\,\`\‘\’\#\?\! ]{1,50}$/, 'Heading must be alphanumeric and between 1 to 50 characters')
    //     .transform((value, originalValue) => {
    //       // const reviewSections = newReview.review_sections;
    //       // reviewSections[fieldKeys.length]?.body = originalValue;
    //       // setNewReview({ ...newReview, review_sections: reviewSections });
    //       console.log('reviewSchema', reviewSchema);
    //       setNewReview({ ...newReview, review_sections: newReview.review_sections[fieldKeys.length]?.heading = originalValue });
    //     })
    //     .required('Heading is required'),
    //   [`body${fieldKeys.length}`]: Yup.string()
    //     .matches(/^[a-zA-Z0-9 ]{20,500}$/, 'Body must be alphanumeric and between 20 to 500 characters')
    //     .transform((value, originalValue) => {
    //       const reviewSections = newReview.review_sections;
    //       // alert(reviewSections[fieldKeys.length]);
    //       console.log('reviewSections', reviewSections);
    //       console.log('reviewSchema', reviewSchema);
    //       // alert(originalValue);
    //       // alert(fieldKeys.length);
    //       reviewSections[fieldKeys.length]?.body = originalValue;
    //       setNewReview({ ...newReview, review_sections: reviewSections });
    //     })
    //     .required('Body is required'),
    // };
    // Yup.object().shape({
    //   heading: Yup.string()
    //     .matches(/^[a-zA-Z0-9 ]{1,50}$/, 'Heading must be alphanumeric and between 1 to 50 characters')
    //     .required('Heading is required'),
    //   body: Yup.string()
    //     .matches(/^[a-zA-Z0-9 ]{20,500}$/, 'Body must be alphanumeric and between 20 to 500 characters')
    //     .required('Body is required'),
    // }),
    // const newFields = {
    //   ...fields,
    //   [`heading${fieldKeys.length / 2}`]: {
    //     initialValue: '',
    //     validation: 'string',
    //   },
    //   [`body${fieldKeys.length / 2}`]: {
    //     initialValue: '',
    //     validation: 'string',
    //   },
    // };
    // const newFields = [
    //   ...fields,
    //   {
    //     heading: {
    //       initialValue: '',
    //       validation: 'string',
    //     },
    //     body: {
    //       initialValue: '',
    //       validation: 'string',
    //     }
    //   },
    // ];
    setFields(newFields);
    // setFieldsValidation(newFieldsValidation);
    const newReviewSection = {
      heading: '',
      body: '',
    };
    setNewReview({
      ...newReview,
      review_sections: [...newReview.review_sections, newReviewSection],
    });
  };

  const handleHeadingChange = (e, id) => {
    e.preventDefault();
    let reviewSections = newReview.review_sections;
    reviewSections[id].heading = e.target.value;
    // const newReviewSections = reviewSections.map((section, index) => {
    //   if (index === id) {
    //     return {
    //       ...section,
    //       heading: e.target.value,
    //     };
    //   }
    //   return section;
    // });
    setNewReview({
      ...newReview,
      review_sections: reviewSections,
    });

    // const newReviewSections = [...newReview.review_sections, { heading: '', body: '' }];
    // setNewReview({
    //   ...newReview,
    //   review_sections: newReviewSections,
    // });
  };

  const handleBodyChange = (e, id) => {
    e.preventDefault();
    let reviewSections = newReview.review_sections;
    reviewSections[id].body = e.target.value;
    setNewReview({
      ...newReview,
      review_sections: reviewSections,
    });
  };

  const handleSubmit = () => {
    console.log('newReviewSubmit', newReview);
    postReview({
      variables: {
        data: {
          bookId: newReview.bookId,
          reviewerId: newReview.reviewerId,
          summary: newReview.summary,
          publishedDate: new Date().toISOString(),
          likeCount: 0,
          review_sections: {
            data: newReview.review_sections,
          },
        },
      },
    });
    setNewReview({
      bookId: '',
      reviewerId: '',
      summary: '',
      likeCount: 0,
      publishedDate: '',
      review_sections: [],
    });
    router.push('/');
  };

  if (loading || postReviewLoading) {
    return (
      <>
        <Loading />
      </>
    );
  } else if (!session?.user?.email) {
    router.push('/forbidden');
    return <></>;
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
              label='ISBN'
              name='isbn'
              type='text'
              muiInputProps={{
                TextFieldProps: {
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                  fullWidth: true,
                  variant: 'outlined',
                  // helperText: getByISBNData ? '' : 'Please enter valid ISBN',
                  // helperText: 'Ssd',
                },
              }}
              errorMessage='Please enter valid ISBN'
            />
            <br /> <br />
            <FTextField
              name='summary'
              type='text'
              label='Summary'
              muiInputProps={{
                TextFieldProps: {
                  id: 'outlined-basic',
                  variant: 'outlined',
                  multiline: true,
                  fullWidth: true,
                },
              }}
              errorMessage='Summary must be alphanumeric and between 20 to 500 characters'
            />
            <div className={classes.horizontalLine}></div>
            {Object.keys(fields).map((data) => {
              return (
                <Grid spacing={3} key={data}>
                  {/* <FTextField
                    muiInputProps={{
                      TextFieldProps: {
                        id: 'outlined-basic',
                        variant: 'outlined',
                        multiline: true,
                        fullWidth: true,
                      },
                    }}
                    name={`heading${data}`}
                    type='string'
                    label='Heading'
                  // errorMessage='Heading must be alphanumeric and between 1 to 50 characters'
                  // onChange={(e) => handleHeadingChange(e, data)}
                  />
                  <br /> <br />
                  <FTextField
                    muiInputProps={{
                      TextFieldProps: {
                        id: 'outlined-basic',
                        variant: 'outlined',
                        multiline: true,
                        fullWidth: true,
                      },
                    }}
                    name={`body${data}`}
                    type='string'
                    label='Body'
                  // errorMessage='Body must be alphanumeric and between 20 to 500 characters'
                  // onChange={(e) => handleBodyChange(e, data)}
                  // value={newReview?.review_sections[data]?.body}
                  /> */}
                  <TextField
                    id='outlined-basic'
                    variant='outlined'
                    multiline
                    fullWidth
                    label='Heading'
                    onChange={(e) => handleHeadingChange(e, data)}
                  // value={fields[data].initialValue}
                  />
                  <br /> <br />
                  <TextField
                    id='outlined-basic'
                    variant='outlined'
                    multiline
                    fullWidth
                    label='Body'
                    onChange={(e) => handleBodyChange(e, data)}
                  // value={fields[data].initialValue}
                  />
                  <br /> <br />
                </Grid>
              );
            })}
            <div
              className={styles.buttonContainer}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              <Button onClick={handleAddFields} variant='outlined'>
                Add Fields
              </Button>
            </div>
            {!newReview.bookId ? (
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
                  {`Sorry we couldn't find the book you are looking for.`}
                </Typography>
              </div>
            ) : getByEmailLoading || getByISBNLoading ? (
              <Loading />
            ) : (
              <FButton
                muiInputProps={{
                  ButtonProps: {
                    variant: 'contained',
                    color: 'primary',
                    type: 'submit',
                    style: {
                      marginTop: '20px',
                      width: '100%',
                    },
                  },
                }}
              >
                Submit
              </FButton>
            )}
          </FForm>
          <br />
        </main>
      </>
    );
  }
}
