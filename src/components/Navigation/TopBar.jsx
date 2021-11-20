import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/dist/client/router';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    display: 'flex',
    zIndex: theme.zIndex.appBar,
    backgroundColor: 'white',
    margin: '0 auto',
    borderBottom: '1px solid #e0e0e0',
  },
  topBar: {
    display: 'flex',
    margin: '0 20px',
    height: '64px',
    width: '100%',
    alignItems: 'center',
    // textAlign: 'left',
    // justifyItems: 'left',
    justifyContent: 'flex-start',
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
  { path: '/search', label: 'Spill', index: 2, search: 1 },
  { path: '/write-review', label: 'Write Review', index: 3, search: 0 },
  { path: '/profile', label: 'Profile', index: 4, search: 0 },
  { path: '/register', label: 'Register', index: 5, search: 0 },
  { path: '/login', label: 'Login', index: 6, search: 0 },
  { path: '/review/*', label: 'Review Detail', index: 7, search: 0 },
];

export const TopBar = () => {
  const classes = useStyles();
  const router = useRouter();

  // useEffect(() => {
  //     const currentRoute = routeIndex.find(route => route.path === router.pathname);
  //     setValue(currentRoute ? currentRoute.index : 1);
  // }, [router.pathname]);

  return (
    <Box className={classes.root}>
      <Box className={classes.topBar}>
        <Typography variant='h6' className={classes.pageTitle}>
          {routeIndex.find((route) => route.path === router.pathname).label}
        </Typography>
      </Box>
    </Box>
  );
};

TopBar.propTypes = {};
