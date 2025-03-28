import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { Button, Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

import { bgBlur, varAlpha } from '../../theme/styles';

import { layoutClasses } from '../classes';
import { Iconify } from '../../components/iconify';
import { CONFIG } from '../../config-global';
// ----------------------------------------------------------------------

export function HeaderSection({ sx, slots, slotProps, layoutQuery = 'md', ...other }) {
  const theme = useTheme();

  const toolbarStyles = {
    default: {
      ...bgBlur({ color: varAlpha(theme.vars.palette.background.defaultChannel, 0.8) }),
      minHeight: 'auto',
      height: 'var(--layout-header-mobile-height)',
      transition: theme.transitions.create(['height', 'background-color'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
      }),
      [theme.breakpoints.up('sm')]: {
        minHeight: 'auto',
      },
      [theme.breakpoints.up(layoutQuery)]: {
        height: 'var(--layout-header-desktop-height)',
      },
    },
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      className={layoutClasses.header}
      sx={{
        boxShadow: 'none',
        zIndex: 'var(--layout-header-zIndex)',
        ...sx,
      }}
      {...other}
    >
      {slots?.topArea}

      <Toolbar
        disableGutters
        {...slotProps?.toolbar}
        sx={{
          ...toolbarStyles.default,
          ...slotProps?.toolbar?.sx,
        }}
      >
        <Container
          {...slotProps?.container}
          sx={{
            height: 1,
            display: 'flex',
            alignItems: 'center',
            ...slotProps?.container?.sx,
          }}
        >
          {slots?.leftArea}
          <Button
            sx={{
              color: 'black',
              fontSize: '1rem',
              display: 'flex',

              alignItems: 'center',
            }}
          >
            <Iconify
              icon="fxemoji:hospital"
              style={{
                marginRight: '10px',
              }}
            />
            {CONFIG.appName}
          </Button>
          <Box sx={{ display: 'flex', flex: '1 1 auto', justifyContent: 'center' }}>
            {slots?.centerArea}
          </Box>
          {slots?.rightArea}
        </Container>
      </Toolbar>

      {slots?.bottomArea}
    </AppBar>
  );
}
