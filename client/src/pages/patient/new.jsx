import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../config-global';

import New from '../../sections/patient/view/new';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`New Patient - ${CONFIG.appName}`}</title>
      </Helmet>

      <New />
    </>
  );
}
