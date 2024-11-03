import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ENV Variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const newPatientMedicalInfo = createAsyncThunk(
  'medicalRecord/newPatientMedicalInfo',
  async (data, { rejectWithValue, getState }) => {
    const { userData } = getState().auth;
    console.log(data);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/newPatientMedicalInfo/${data?.patientId}`,
        data?.medicalInfo,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create new medical record: ', error);
      return rejectWithValue(error.response?.data || 'Request failed due to an unexpected error.');
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  newMedicalInfo: null,
};

const medicalRecordSlice = createSlice({
  name: 'medicalRecord',
  initialState,
  reducers: {
    resetErrors(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newPatientMedicalInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.newMedicalInfo = null;
      })
      .addCase(newPatientMedicalInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.newMedicalInfo = action.payload;
      })
      .addCase(newPatientMedicalInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

// Export logout action for use in components
export const { resetErrors } = medicalRecordSlice.actions;

export default medicalRecordSlice.reducer;
