import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../config-global';

import View from '../../sections/user/view/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <View />
    </>
  );
}
