import { SvgColor } from '../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  // {
  //   title: 'Dashboard',
  //   path: '/',
  //   icon: icon('ic-analytics'),
  // },
  {
    title: 'Users',
    path: '/users',
    icon: icon('ic-user'),
  },
  {
    title: 'Patient Profile',
    path: '/patient-profile',
    icon: icon('ic-profile'),
  },
  {
    title: 'Appointments',
    path: '/appointments',
    icon: icon('ic-appointments'),
  },
  {
    title: 'Patients',
    path: '/patients',
    icon: icon('ic-patient'),
  },
  {
    title: 'Visits',
    path: '/visits',
    icon: icon('ic-visit'),
  },
];
