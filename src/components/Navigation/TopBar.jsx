import React, { useState, useEffect } from 'react';
import { Box, Form, Typography } from '@mui/material';
import { useRouter } from 'next/dist/client/router';
import { makeStyles } from '@mui/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
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
  { path: ['/', '/dashboard', '/search'], label: 'Spill', index: 1, search: 1 },
  { path: ['/review/write'], label: 'Write Review', index: 2, search: 0 },
  { path: ['/account'], label: 'Account', index: 3, search: 0 },
  { path: ['/review'], label: 'Review Detail', index: 4, search: 0 },
];

export const TopBar = () => {
  const classes = useStyles();
  const router = useRouter();
  const keyword = router.query.keyword;
  const [search, setSearch] = useState('');
  const label = routeIndex.find((route) => route.path.includes(router.pathname))?.label;

  // useEffect(() => {
  //     const currentRoute = routeIndex.find(route => route.path === router.pathname);
  //     setValue(currentRoute ? currentRoute.index : 1);
  // }, [router.pathname]);

  useEffect(() => {
    if (keyword && router.pathname === '/search') {
      setSearch(keyword);
    }
  }, [keyword, router.pathname]);

  const handleChange = (e) => {
    setSearch(e.target.value);
    alert(search);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search) {
      router.push(`/search?/${search}`);
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.topBar}>
        <Typography className={classes.pageTitle}>{label ? label : 'Spill'}</Typography>
        {routeIndex.find((route) => route.path.includes(router.pathname))?.search === 1 && (
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            {/* <Form onSubmit={handleSubmit}> */}
            {/* <Form> */}
            <StyledInputBase
              placeholder='Search…'
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleChange}
              value={search}
            />
            {/* <FTextField name="search" label="Search" /> */}
            {/* </Form> */}
          </Search>
        )}
      </Box>
    </Box>
  );
};
