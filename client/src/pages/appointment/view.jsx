import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../config-global';

import Appointments from '../../sections/appointment/view/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Appoinments - ${CONFIG.appName}`}</title>
      </Helmet>

      <Appointments />
    </>
  );
}
