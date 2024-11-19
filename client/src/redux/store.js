import { configureStore } from '@reduxjs/toolkit';
import tokenExpirationMiddleware from './middleware';

import authSlice from './authSlice';
import userSlice from './userSlice';
import patientSlice from './patientSlice';
import visitSlice from './visitSlice';
import patientProfileSlice from './patientProfileSlice';
import medicalRecordSlice from './medicalRecordSlice';
import appointmentSlice from './appointmentSlice';
import configSlice from './configSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    patient: patientSlice,
    visit: visitSlice,
    patientProfile: patientProfileSlice,
    medicalRecord: medicalRecordSlice,
    appointment: appointmentSlice,
    config: configSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tokenExpirationMiddleware),
});

export default store;
