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

// Default Pages
export const HomePage = lazy(() => import('../pages/homepage'));
export const Dashboard = lazy(() => import('../pages/dashboard'));
export const Page404 = lazy(() => import('../pages/page-not-found'));

// Auth
export const LoginPage = lazy(() => import('../pages/login'));
export const RegisterPage = lazy(() => import('../pages/register'));

// Custom Pages
export const UserPage = lazy(() => import('../pages/user/view'));
export const NewUserPage = lazy(() => import('../pages/user/new'));
export const PatientProfile = lazy(() => import('../pages/patient/profile'));
export const PatientPage = lazy(() => import('../pages/patient/view'));
export const NewPatientPage = lazy(() => import('../pages/patient/new'));
export const NewMedicalRecord = lazy(() => import('../pages/patient/medical'));
export const VisitPage = lazy(() => import('../pages/visit/view'));
export const NewVisitPage = lazy(() => import('../pages/visit/new'));
export const AppointmentsPage = lazy(() => import('../pages/appointment/view'));
export const SettingsPage = lazy(() => import('../pages/config'));

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
          path: 'dashboard',
          element: (
            <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']} component={Dashboard} />
          ),
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

        {
          path: 'patient-profile',
          element: (
            <ProtectedRoute
              allowedRoles={['admin', 'staff', 'doctor']}
              component={PatientProfile}
            />
          ),
        },
        {
          path: 'patients',
          element: (
            <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']} component={PatientPage} />
          ),
        },
        {
          path: 'new-patient',
          element: (
            <ProtectedRoute
              allowedRoles={['admin', 'staff', 'doctor']}
              component={NewPatientPage}
            />
          ),
        },
        {
          path: 'visits',
          element: (
            <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']} component={VisitPage} />
          ),
        },
        {
          path: 'new-visit/:patientId',
          element: (
            <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']} component={NewVisitPage} />
          ),
        },
        {
          path: 'new-medical-record/:patientId',
          element: (
            <ProtectedRoute
              allowedRoles={['admin', 'staff', 'doctor']}
              component={NewMedicalRecord}
            />
          ),
        },
        {
          path: 'appointments',
          element: (
            <ProtectedRoute
              allowedRoles={['admin', 'staff', 'doctor']}
              component={AppointmentsPage}
            />
          ),
        },
        {
          path: 'settings',
          element: (
            <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']} component={SettingsPage} />
          ),
        },
      ],
    },

    // dont use protected routes for public pages such as landing page or homepage in this case
    {
      index: true,
      path: '/',
      element: <HomePage />,
    },

    // can wrap in protected routes as well but we will use below method here
    // {
    //   path: 'login',
    //   element: <ProtectedRoute noAuthReq component={LoginPage} />,
    // },
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
