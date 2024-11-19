import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';

import ViewPage from '../sections/settings/view';

// ----------------------------------------------------------------------

export default function View() {
  return (
    <>
      <Helmet>
        <title> {`Settings - ${CONFIG.appName}`}</title>
      </Helmet>

      <ViewPage />
    </>
  );
}
