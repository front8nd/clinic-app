import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../config-global';

import View from '../../sections/patient/view/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Patients - ${CONFIG.appName}`}</title>
      </Helmet>

      <View />
    </>
  );
}
