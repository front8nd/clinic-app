import { configureStore } from '@reduxjs/toolkit';
import tokenExpirationMiddleware from './middleware';

import authSlice from './authSlice';
import userSlice from './userSlice';
import patientSlice from './patientSlice';
import visitSlice from './visitSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    patient: patientSlice,
    visit: visitSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tokenExpirationMiddleware),
});

export default store;
