import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../config-global';

import NewUser from '../../sections/user/view/user-new';

// ----------------------------------------------------------------------

export default function NewUserPage() {
  return (
    <>
      <Helmet>
        <title> {`New User - ${CONFIG.appName}`}</title>
      </Helmet>

      <NewUser />
    </>
  );
}
