import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../config-global';

import View from '../../sections/visit/view/new';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`New Patient Visit - ${CONFIG.appName}`}</title>
      </Helmet>

      <View />
    </>
  );
}
