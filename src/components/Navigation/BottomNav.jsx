import React, { useState, useEffect } from 'react';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CreateIcon from '@mui/icons-material/Create';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/dist/client/router';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    right: 0,
    left: 0,
    display: 'flex',
    zIndex: theme.zIndex.appBar,
    backgroundColor: theme.palette.background.paper,
    margin: '0 auto',
  },
  selected: {
    color: theme.palette.primary.main,
  },
  bottomNavigation: {
    margin: 'auto',
    width: 576,
    height: 76,
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const routeIndex = [
  { selected: ['/', '/search', '/review/3'], path: '/', label: 'Home', icon: <HomeIcon />, index: 1 },
  {
    selected: ['/review/update', '/review/write'],
    path: '/review/write',
    label: 'Review',
    icon: <CreateIcon />,
    index: 2,
  },
  { selected: ['/account', '/account/login'], path: '/account', label: 'Account', icon: <PersonIcon />, index: 3 },
];

export const BottomNav = () => {
  const classes = useStyles();
  const router = useRouter();
  // const [value, setValue] = useState(routeIndex.findIndex((route) => route.path === router.pathname) + 1);
  const [value, setValue] = useState(routeIndex.findIndex((route) => route.selected.includes(router.pathname)) + 1);

  useEffect(() => {
    // const currentRoute = routeIndex.find((route) => route.path === router.pathname);
    const currentRoute = routeIndex.find((route) => route.selected.includes(router.pathname));
    setValue(currentRoute ? currentRoute.index : 0);
  }, [router.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    router.push(routeIndex[newValue - 1].path);
  };

  return (
    <Box className={classes.root}>
      <BottomNavigation value={value} onChange={handleChange} className={classes.bottomNavigation}>
        {routeIndex.map((route) => (
          <BottomNavigationAction
            key={route.label}
            label={route.label}
            value={route.index}
            icon={route.icon}
            // className={value === route.index ? classes.selected : undefined}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};

BottomNav.propTypes = {};
