import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { makeStyles } from '@mui/styles';
import { Autocomplete, TextField, Button, Grid, Typography, Container, Link, Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery, useMutation } from '@apollo/client';
import styles from '../../styles/Home.module.css';
import Loading from '../../src/components/Page/Loading';
import { FForm, FTextField } from '@formulir/material-ui';
import { GET_BOOK_BY_ISBN } from '../../src/libs/GraphQL/query';
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
}));

export default function Dashboard() {
  const classes = useStyles();
  const router = useRouter();
  const [session, loading] = useSession();
  const [search, setSearch] = useState('');
  const [isbn, setIsbn] = useState('');
  // const initialValues = {
  //   summary: '',
  //   section: {
  //     initialValues: [],
  //     validation: 'array',
  //   },
  // };
  const [fields, setFields] = useState({});
  const initialValues = {
    isbn: {
      initialValue: '',
      validation: 'string',
    },
    summary: {
      initialValue: '',
      validation: 'string',
    },
    section: {
      ...fields,
    }
  };

  const isbnSchema = Yup.object().shape({
    isbn: Yup.string()
      .matches(/^978[0-9]{10}$/, 'ISBN must be 13 digits')
      .transform((value, originalValue) => {
        // console.log(value, originalValue);
        setIsbn(originalValue);
        return originalValue;
      })
      .required('ISBN is required'),
  });

  const {
    data: getByISBNData,
    loading: getByISBNLoading,
    error: getByISBNError,
    get,
  } = useQuery(GET_BOOK_BY_ISBN, { variables: { isbn } });

  console.log('getByISBNData', getByISBNData);

  // useEffect(() => {
  //   if (!session?.user?.email) {
  //     router.push('/forbidden');
  //   }
  // }, [session]);

  const handleAddFields = () => {
    const fieldKeys = Object.keys(fields);

    const newFields = {
      ...fields,
      [`heading${fieldKeys.length}`]: {
        initialValue: '',
        validation: 'string',
      },
      [`body${fieldKeys.length}`]: {
        initialValue: '',
        validation: 'string',
      },
    };
    setFields(newFields);
  };

  if (loading) {
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
            onSubmit={(values) => { }}
            initialValues={initialValues}
            style={{ width: '100%' }}
            validationSchema={isbnSchema}
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
                    )
                  },
                  fullWidth: true,
                  variant: 'outlined',
                }
              }}
              errorMessage='Please enter valid ISBN'
            />
            <br /> <br />
            <FTextField name="summary" type="text" label='Summary' muiInputProps={{
              TextFieldProps: {
                id: 'outlined-basic',
                variant: 'outlined',
                multiline: true,
                fullWidth: true,
              }
            }}
              errorMessage='Please enter a summary'
            />
            {
              Object.keys(fields).map(data => (
                <Grid spacing={3} key={data}>
                  <br />
                  <FTextField muiInputProps={{
                    TextFieldProps: {
                      id: 'outlined-basic',
                      variant: 'outlined',
                      multiline: true,
                      fullWidth: true,
                    }
                  }}
                    name={data} type="string" label={data} />
                </Grid>
              ))
            }
            {/* <br /><br />
            <FTextField id='outlined-basic' name="heading" type="string" label='Heading' variant='outlined' fullWidth multiline />
            <br /><br />
            <FTextField id='outlined-basic' name="body" type="string" label='Body' variant='outlined' fullWidth multiline /> */}
          </FForm>
          <Button onClick={handleAddFields}>Add Fields</Button>
          <br />
        </main>
      </>
    );
  }
}
