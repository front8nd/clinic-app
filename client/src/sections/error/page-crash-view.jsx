import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { SimpleLayout } from '../../layouts/simple';
import { Iconify } from '../../components/iconify';

export function PageCrashView({ error }) {
  return (
    <SimpleLayout content={{ compact: true }}>
      <Container>
        <Container
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}
        >
          <Iconify width={32} icon="fluent-color:error-circle-16" />
          <Typography variant="h4" fullWidth>
            Something went wrong!
          </Typography>
        </Container>
        <Typography sx={{ color: 'red', mb: 2 }}>
          <span
            style={{
              fontWeight: 'bold',
            }}
          >
            Error Log:
          </span>{' '}
          {error?.message || 'An unexpected error occurred.'}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', wordWrap: 'break-word' }}>
          Please refresh the page. If the error persists, please contact support.
        </Typography>
      </Container>
    </SimpleLayout>
  );
}
