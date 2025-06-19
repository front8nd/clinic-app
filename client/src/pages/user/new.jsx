import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../config-global';

import New from '../../sections/user/view/new';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`New User - ${CONFIG.appName}`}</title>
      </Helmet>

      <New />
    </>
  );
}
