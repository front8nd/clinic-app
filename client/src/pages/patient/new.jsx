import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../config-global';

import PatientNew from '../../sections/patient/view/patient-new';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> {`New Patient - ${CONFIG.appName}`}</title>
      </Helmet>

      <PatientNew />
    </>
  );
}
