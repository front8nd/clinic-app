import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

// Route Protected
import ProtectedRoute from './Protected';

// Routes
import { varAlpha } from '../theme/styles';
import { AuthLayout } from '../layouts/auth/index';
import { DashboardLayout } from '../layouts/dashboard/index';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('../pages/home'));
export const LoginPage = lazy(() => import('../pages/login'));
export const RegisterPage = lazy(() => import('../pages/register'));
export const UserPage = lazy(() => import('../pages/user/user'));
export const NewUserPage = lazy(() => import('../pages/user/new'));
export const Page404 = lazy(() => import('../pages/page-not-found'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element: (
            <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']} component={HomePage} />
          ),
          index: true,
        },
        {
          path: 'users',
          element: (
            <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']} component={UserPage} />
          ),
        },
        {
          path: 'new-user',
          element: (
            <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']} component={NewUserPage} />
          ),
        },
      ],
    },
    {
      path: 'login',
      element: (
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
