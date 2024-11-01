import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../../config-global';

import PatientView from '../../sections/patient/view/patient-view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> {`Patients - ${CONFIG.appName}`}</title>
      </Helmet>

      <PatientView />
    </>
  );
}
