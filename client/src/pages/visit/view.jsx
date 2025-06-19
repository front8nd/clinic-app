import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../config-global';

import View from '../../sections/visit/view/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Patient Visits - ${CONFIG.appName}`}</title>
      </Helmet>

      <View />
    </>
  );
}
