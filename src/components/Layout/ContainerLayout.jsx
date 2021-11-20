import React from 'react';
import { Container, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flow-root',
    minHeight: '100vh',
    margin: '64px auto',
  },
}));

export const ContainerLayout = ({ children }) => {
  const classes = useStyles();

  return (
    <Box>
      <Container className={classes.root}>
        <Box>{children}</Box>
      </Container>
    </Box>
  );
};

ContainerLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
};
