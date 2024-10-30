import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../config-global';

import UserView from '../../sections/user/view/user-view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> {`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserView />
    </>
  );
}
