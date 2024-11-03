import { configureStore } from '@reduxjs/toolkit';
import tokenExpirationMiddleware from './middleware';

import authSlice from './authSlice';
import userSlice from './userSlice';
import patientSlice from './patientSlice';
import visitSlice from './visitSlice';
import patientProfileSlice from './patientProfileSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    patient: patientSlice,
    visit: visitSlice,
    patientProfile: patientProfileSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tokenExpirationMiddleware),
});

export default store;
