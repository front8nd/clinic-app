import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';

import Login from '../sections/auth/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> {`Login in - ${CONFIG.appName}`}</title>
      </Helmet>

      <Login />
    </>
  );
}
