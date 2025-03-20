import './global.css';

import { Router } from './routes/sections';

import { useScrollToTop } from './hooks/use-scroll-to-top';

import { ThemeProvider } from './theme/theme-provider';

import { SnackbarProvider } from './components/snackbar/snackbar';

import { ErrorBoundary } from 'react-error-boundary';

import FallBackRender from './components/fallback-render';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ErrorBoundary fallbackRender={<FallBackRender />}>
      <ThemeProvider>
        <SnackbarProvider>
          <Router />
        </SnackbarProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
