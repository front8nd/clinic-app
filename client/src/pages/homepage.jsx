import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';

import { useRouter } from '../routes/hooks';

// ----------------------------------------------------------------------

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    router.push('/users');
  }, [router]);

  return (
    <>
      <Helmet>
        <title> {`Homepage - ${CONFIG.appName}`}</title>
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>
    </>
  );
}
