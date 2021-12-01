import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { makeStyles } from '@mui/styles';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { FButton, FForm, FTextField } from '@formulir/material-ui';
import * as Yup from 'yup';
import styles from '../../../styles/Home.module.css';
import Loading from '../../../src/components/Page/Loading';
import Error from '../../../src/components/Page/Error';
import { GET_REVIEW_BY_ID, GET_REVIEWER_BY_EMAIL, UPDATE_REVIEW, UPDATE_REVIEW_SECTION } from '../../../src/libs/GraphQL/query';

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

export default function Update() {
  const classes = useStyles();
  const router = useRouter();
  const [session, loading] = useSession();
  // const [review, setReview] = useState({
  //   id: router.query.id,
  //   bookId: '',
  //   reviewerId: '',
  //   summary: '',
  //   publishedDate: '',
  //   likeCount: 0,
  // });

  const [updatedReview, setUpdatedReview] = useState({
    bookId: '',
    reviewerId: '',
    summary: '',
    review_sections: [],
  });

  const [fields, setFields] = useState({});
  const initialValues = {
    summary: {
      initialValue: '',
      validation: 'string',
    },
    ...fields,
  };

  const reviewSchema = Yup.object().shape({
    summary: Yup.string()
      .matches(
        /^[a-zA-Z0-9\.\'\"\-\,\`\‘\’ ]{20,500}$/,
        'Summary must be alphanumeric and between 20 to 500 characters',
      )
      .transform((value, originalValue) => {
        setUpdatedReview({ ...updatedReview, summary: originalValue });
        return originalValue;
      })
      .required('Summary is required'),
    section: Yup.array().of(
      Yup.object().shape({
        heading: Yup.string()
          .matches(/^[a-zA-Z0-9 ]{1,50}$/, 'Heading must be alphanumeric and between 1 to 50 characters')
          .required('Heading is required'),
        body: Yup.string()
          .matches(/^[a-zA-Z0-9 ]{20,500}$/, 'Body must be alphanumeric and between 20 to 500 characters')
          .required('Body is required'),
      }),
    ),
  });

  // const {
  //   data: getByEmailData,
  //   loading: getByEmailLoading,
  //   error: getByEmailError,
  // } = useQuery(GET_REVIEWER_BY_EMAIL, {
  //   variables: { email: session?.user?.email },
  // });
  const {
    data: getByIdData,
    loading: getByIdLoading,
    error: getByIdError,
  } = useQuery(GET_REVIEW_BY_ID, { variables: { id: router.query.id } });
  // const [postReview, { loading: postReviewLoading, error: postReviewError }] = useMutation(POST_REVIEW, {
  //   variables: { data: updatedReview },
  // });
  const [updateReview, { loading: updateReviewLoading, error: updateReviewError }] = useMutation(UPDATE_REVIEW);

  const [updateReviewSection, { loading: updateReviewSectionLoading, error: updateReviewSectionError }] = useMutation(UPDATE_REVIEW_SECTION);

  // console.log('getByIdData', getByIdData);
  // console.log('updatedReview', updatedReview);
  // console.log('session', session);
  // console.log('date', new Date().toISOString());

  // useEffect(() => {
  //   if (getByEmailData) {
  //     setUpdatedReview({
  //       ...updatedReview,
  //       reviewerId: getByEmailData?.spill_reviewer[0]?.id,
  //     });
  //     setReview({
  //       ...review,
  //       reviewerId: getByEmailData?.spill_reviewer[0]?.id,
  //     });
  //   }
  // }, [getByEmailData]);

  useEffect(() => {
    if (getByIdData) {
      setUpdatedReview({
        ...updatedReview,
        bookId: getByIdData?.spill_review_by_pk?.book?.id,
        reviewerId: getByIdData.spill_review_by_pk?.reviewer?.id,
        summary: getByIdData.spill_review_by_pk?.summary,
        review_sections: getByIdData.spill_review_by_pk?.review_sections,
        publishedDate: getByIdData.spill_review_by_pk?.publishedDate,
        likeCount: getByIdData.spill_review_by_pk?.likeCount,
      });
      // setReview({
      //   ...review,
      //   reviewerId: getByIdData.spill_review_by_pk?.reviewer?.id,
      //   summary: getByIdData.spill_review_by_pk?.summary,
      //   publishedDate: getByIdData.spill_review_by_pk?.publishedDate,
      //   likeCount: getByIdData.spill_review_by_pk?.likeCount,
      // });
    }
  }, [getByIdData]);

  // const handleAddFields = (e) => {
  //   e.preventDefault();
  //   const fieldKeys = Object.keys(fields);

  //   const newFields = {
  //     ...fields,
  //     [`${fieldKeys.length}`]: {
  //       initialValue: '',
  //       validation: 'string',
  //     },
  //   };
  //   setFields(newFields);
  //   const updatedReviewSection = {
  //     heading: '',
  //     body: '',
  //   };
  //   setUpdatedReview({
  //     ...updatedReview,
  //     review_sections: [...updatedReview?.review_sections, updatedReviewSection],
  //   });
  // };

  const handleHeadingChange = (e, id) => {
    e.preventDefault();
    console.log('id', parseInt(router.query.id));
    // console.log('bookid', parseInt(updatedReview.bookId));
    setUpdatedReview({
      ...updatedReview,
      review_sections: updatedReview.review_sections.map((section, index) => {
        if (index === id) {
          return {
            ...section,
            heading: e.target.value,
          };
        }
        return section;
      }),
    });
  };

  const handleBodyChange = (e, id) => {
    e.preventDefault();
    setUpdatedReview({
      ...updatedReview,
      review_sections: updatedReview.review_sections.map((section, index) => {
        if (index === id) {
          return {
            ...section,
            body: e.target.value,
          };
        }
        return section;
      }),
    });
  };

  const handleSubmit = () => {
    // console.log('updatedReviewSubmit', updatedReview);
    const hey = {
      id: parseInt(router.query.id),
      data: {
        bookId: updatedReview.bookId,
        reviewerId: updatedReview.reviewerId,
        summary: updatedReview.summary,
        publishedDate: new Date().toISOString(),
        likeCount: 0,
        // review_sections: {
        //   data: newReview.review_sections,
        // },
      },
    }
    console.log('hey', hey)
    updateReview({
      variables: {
        id: parseInt(router.query.id),
        data: {
          bookId: updatedReview.bookId,
          reviewerId: updatedReview.reviewerId,
          summary: updatedReview.summary,
          publishedDate: new Date().toISOString(),
          likeCount: 0,
          // review_sections: {
          //   data: newReview.review_sections,
          // },
        },
      },
    });

    // updatedReview.review_sections.forEach((section) => {
    //   updateReviewSection({
    //     variables: {
    //       id: parseInt(section.id),
    //       data: {
    //         // id: section.id,
    //         reviewId: updatedReview.id,
    //         heading: section.heading,
    //         body: section.body,
    //       },
    //     },
    //   });
    // });

    setUpdatedReview({
      bookId: '',
      reviewerId: '',
      summary: '',
      likeCount: 0,
      publishedDate: '',
      review_sections: [],
    });

    router.push('/account');
  };

  if (loading || getByIdLoading || updateReviewLoading || updateReviewSectionLoading) {
    return (
      <>
        <Loading />
      </>
    );
  } else if (!session?.user?.email || session?.user?.email !== getByIdData.spill_review_by_pk?.reviewer?.email) {
    router.push('/forbidden');
    return <></>;
  } else if (updateReviewError || updateReviewSectionLoading || getByIdError) {
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
            Update your review here
          </Typography>

          <FForm
            onSubmit={handleSubmit}
            initialValues={initialValues}
            style={{ width: '100%' }}
            validationSchema={reviewSchema}
          >
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
                  value: updatedReview.summary,
                },
              }}
              errorMessage='Summary must be alphanumeric and between 20 to 500 characters'
            />
            <div className={classes.horizontalLine}></div>
            {updatedReview.review_sections.map((reviewSection, index) => (
              <Grid spacing={3} key={index}>
                <TextField
                  id='outlined-basic'
                  variant='outlined'
                  multiline
                  fullWidth
                  label='Heading'
                  onChange={(e) => handleHeadingChange(e, index)}
                  value={reviewSection.heading}
                />
                <br /> <br />
                <TextField
                  id='outlined-basic'
                  variant='outlined'
                  multiline
                  fullWidth
                  label='Body'
                  onChange={(e) => handleBodyChange(e, index)}
                  value={reviewSection.body}
                />
                <br /> <br />
              </Grid>
            ))}
            {Object.keys(fields).map((data) => {
              // console.log('data', data);
              return (
                <Grid spacing={3} key={data}>
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
            {/* <br /><br />
            <FTextField id='outlined-basic' name="heading" type="string" label='Heading' variant='outlined' fullWidth multiline />
            <br /><br />
            <FTextField id='outlined-basic' name="body" type="string" label='Body' variant='outlined' fullWidth multiline /> */}
            {/* <div
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
            </div> */}
            {getByIdLoading ? (
              <Loading />
            ) : (
              <FButton
                style={{
                  disabled: true,
                }}
                muiInputProps={{
                  ButtonProps: {
                    variant: 'contained',
                    color: 'primary',
                    type: 'submit',
                    disabled: true,
                    style: {
                      marginTop: '20px',
                      width: '100%',
                    },
                  },
                }}
              >
                Update
              </FButton>
            )}
          </FForm>
          <br />
        </main>
      </>
    );
  }
}
