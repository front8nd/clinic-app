import { configureStore } from '@reduxjs/toolkit';
import tokenExpirationMiddleware from './middleware';

import authSlice from './authSlice';
import userSlice from './userSlice';
import patientSlice from './patientSlice';
import visitSlice from './visitSlice';
import patientProfileSlice from './patientProfileSlice';
import medicalRecordSlice from './medicalRecordSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    patient: patientSlice,
    visit: visitSlice,
    patientProfile: patientProfileSlice,
    medicalRecord: medicalRecordSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tokenExpirationMiddleware),
});

export default store;
