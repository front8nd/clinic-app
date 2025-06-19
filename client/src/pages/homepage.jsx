import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';

import HomePage from '../sections/homepage/view';
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Book an Appointment - ${CONFIG.appName}`}</title>
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <HomePage />
    </>
  );
}
