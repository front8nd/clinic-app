import { SvgColor } from '../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Users',
    path: '/users',
    icon: icon('ic-user'),
  },
  {
    title: 'Patients',
    path: '/patients',
    icon: icon('ic-patient'),
  },
  {
    title: 'Visit',
    path: '/visits',
    icon: icon('ic-visit'),
  },
];
