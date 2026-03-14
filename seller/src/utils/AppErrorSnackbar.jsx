import React, { useEffect } from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AppErrorSnackbar = ({ message, open, onClose }) => {
  useEffect(() => {
    console.log("ErrorSnackbar Rendered");
    console.log("Message:", message);
    console.log("Open:", open);
    console.log("onClose function exists:", typeof onClose === 'function');
  }, [message, open, onClose]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        severity="error"
        variant="filled"
        action={
          <IconButton size="small" color="inherit" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AppErrorSnackbar;