import React, { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import PropTypes from 'prop-types';
import { BottomNav } from '../Navigation/BottomNav';
import { ContainerLayout } from './ContainerLayout';
// import { ContainerLayout } from '../Layout/ContainerLayout';

export const RootLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity='error'>
          This is an error message!
        </Alert>
      </Snackbar>
      <ContainerLayout>
        <Box>{children}</Box>
      </ContainerLayout>
      {/* <Box
        style={{
          position: 'relative',
        }}
      > */}
      <BottomNav />
      {/* </Box> */}
    </Box>
  );
};

RootLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
};
