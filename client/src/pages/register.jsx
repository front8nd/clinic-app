import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';

import Register from '../sections/auth/register';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> {`Register - ${CONFIG.appName}`}</title>
      </Helmet>

      <Register />
    </>
  );
}
