import './global.css';

import { Router } from './routes/sections';

import { useScrollToTop } from './hooks/use-scroll-to-top';

import { ThemeProvider } from './theme/theme-provider';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
