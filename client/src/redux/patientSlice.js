import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ENV Variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const patients = createAsyncThunk(
  'patient/patients',
  async ({ page, limit, date }, { rejectWithValue, getState }) => {
    const { userData } = getState().auth;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/patients?page=${page}&limit=${limit}&date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Retriving patients list failed: ', error);
      return rejectWithValue(error.response?.data || 'Request failed due to an unexpected error.');
    }
  }
);

export const newPatientProfile = createAsyncThunk(
  'patient/newPatientProfile',
  async (data, { rejectWithValue, getState }) => {
    const { userData } = getState().auth;
    try {
      const response = await axios.post(`${API_BASE_URL}/newPatientProfile`, data, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Cannot create new patient profile: ', error);
      return rejectWithValue(error.response?.data || 'Request failed due to an unexpected error.');
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  registrationSuccess: null,
  registrationError: null,
  patientsList: [],
  patient: null,
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    resetErrors(state) {
      state.error = null;
      state.registrationError = null;
      state.registrationSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(patients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patients.fulfilled, (state, action) => {
        state.loading = false;
        state.patientsList = action.payload;
      })
      .addCase(patients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(newPatientProfile.pending, (state) => {
        state.loading = true;
        state.registrationError = null;
        state.registrationSuccess = null;
      })
      .addCase(newPatientProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.registrationSuccess = true;
      })
      .addCase(newPatientProfile.rejected, (state, action) => {
        state.loading = false;
        state.registrationSuccess = false;
        state.registrationError = action.payload || action.error.message;
      });
  },
});

// Export logout action for use in components
export const { resetErrors } = patientSlice.actions;

export default patientSlice.reducer;
