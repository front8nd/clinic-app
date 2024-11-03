import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../config-global';

import Profile from '../../sections/patient/view/profile';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Patient Profile - ${CONFIG.appName}`}</title>
      </Helmet>

      <Profile />
    </>
  );
}
