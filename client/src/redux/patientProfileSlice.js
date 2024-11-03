import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ENV Variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const patientCompleteProfile = createAsyncThunk(
  'patientProfile/patientCompleteProfile',
  async (id, { rejectWithValue, getState }) => {
    const { userData } = getState().auth;
    try {
      const response = await axios.get(`${API_BASE_URL}/patientCompleteProfile/${id}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Retriving patients list failed: ', error);
      return rejectWithValue(error.response?.data || 'Request failed due to an unexpected error.');
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  patientProfile: null,
};

const patientProfileSlice = createSlice({
  name: 'patientProfile',
  initialState,
  reducers: {
    resetErrors(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(patientCompleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.patientProfile = null;
      })
      .addCase(patientCompleteProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.patientProfile = action.payload;
      })
      .addCase(patientCompleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

// Export logout action for use in components
export const { resetErrors } = patientProfileSlice.actions;

export default patientProfileSlice.reducer;
