import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/dist/client/router';
import { makeStyles } from '@mui/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { FForm, FTextField } from '@formulir/material-ui';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  //   marginLeft: 0,
  marginRight: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    zIndex: theme.zIndex.appBar,
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    borderBottom: '1px solid #e0e0e0',
    alignItems: 'center',
    alignContent: 'center',
  },
  topBar: {
    display: 'flex',
    margin: '0 20px',
    height: '64px',
    width: '576px',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    color: theme.palette.primary.main,
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    textAlign: 'left',
  },
}));

const routeIndex = [
  { path: '/', label: 'Spill', index: 1, search: 1 },
  { path: '/dashboard', label: 'Spill', index: 2, search: 1 },
  { path: '/search', label: 'Spill', index: 3, search: 1 },
  { path: '/write-review', label: 'Write Review', index: 4, search: 0 },
  { path: '/profile', label: 'Profile', index: 5, search: 0 },
  { path: '/register', label: 'Register', index: 6, search: 0 },
  { path: '/login', label: 'Login', index: 7, search: 0 },
  { path: '/review/*', label: 'Review Detail', index: 8, search: 0 },
];

export const TopBar = () => {
  const classes = useStyles();
  const router = useRouter();

  // useEffect(() => {
  //     const currentRoute = routeIndex.find(route => route.path === router.pathname);
  //     setValue(currentRoute ? currentRoute.index : 1);
  // }, [router.pathname]);

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);
    setSubmitting(false);
  };

  const initialValues = { search: { initialValue: '', validation: 'string' } };

  return (
    <Box className={classes.root}>
      <Box className={classes.topBar}>
        <Typography className={classes.pageTitle}>
          {routeIndex.find((route) => route.path === router.pathname)?.label}
        </Typography>
        {routeIndex.find((route) => route.path === router.pathname)?.search === 1 && (
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <FForm initialValues={initialValues} onSubmit={handleSubmit}>
              <StyledInputBase placeholder='Search…' inputProps={{ 'aria-label': 'search' }} />
              {/* <FTextField name="search" label="Search" /> */}
            </FForm>
          </Search>
        )}
      </Box>
    </Box>
  );
};

TopBar.propTypes = {};
