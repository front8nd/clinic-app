import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../config-global';

import Medical from '../../sections/patient/view/medical';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`New Medical Record - ${CONFIG.appName}`}</title>
      </Helmet>

      <Medical />
    </>
  );
}
