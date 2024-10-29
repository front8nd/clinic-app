import './global.css';

import { Router } from './routes/sections';

import { useScrollToTop } from './hooks/use-scroll-to-top';

import { ThemeProvider } from './theme/theme-provider';

import { SnackbarProvider } from './components/snackbar/snackbar';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <SnackbarProvider>
        <Router />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
