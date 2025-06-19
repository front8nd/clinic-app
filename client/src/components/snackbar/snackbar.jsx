// SnackbarContext.js
import React, { createContext, useState, useMemo, useCallback, useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Create context
const SnackbarContext = createContext();

// Provider component
export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'success',
  });

  // Wrap openSnackbar in useCallback to avoid re-creating it on each render
  const openSnackbar = useCallback((message, type = 'success') => {
    setSnackbar({ open: true, message, type });
  }, []);

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Memoize contextValue so it doesn't change on each render
  const contextValue = useMemo(() => ({ openSnackbar }), [openSnackbar]);

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// SnackbarContext.js
export const useSnackbar = () => useContext(SnackbarContext);
