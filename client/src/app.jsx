import './global.css';

import { Router } from './routes/sections';

import { useScrollToTop } from './hooks/use-scroll-to-top';

import { ThemeProvider } from './theme/theme-provider';

import { SnackbarProvider } from './components/snackbar/snackbar';

import { ErrorBoundary } from 'react-error-boundary';

import { PageCrashView } from './sections/error/page-crash-view';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <ErrorBoundary fallbackRender={PageCrashView}>
        <SnackbarProvider>
          <Router />
        </SnackbarProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
