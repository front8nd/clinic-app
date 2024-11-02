import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ENV Variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const visits = createAsyncThunk(
  'visit/visits',
  async ({ page, limit, date }, { rejectWithValue, getState }) => {
    const { userData } = getState().auth;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/visits?page=${page}&limit=${limit}&date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Retriving visitors list failed: ', error);
      return rejectWithValue(error.response?.data || 'Request failed due to an unexpected error.');
    }
  }
);

export const newPatientVisit = createAsyncThunk(
  'visit/newPatientVisit',
  async (data, { rejectWithValue, getState }) => {
    const { userData } = getState().auth;
    try {
      const response = await axios.post(`${API_BASE_URL}/newPatientVisit`, data, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Cannot create new patient visit: ', error);
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
  visitList: [],
  visit: null,
};

const visitSlice = createSlice({
  name: 'visit',
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
      .addCase(visits.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.visitList = null;
      })
      .addCase(visits.fulfilled, (state, action) => {
        state.loading = false;
        state.visitList = action.payload;
      })
      .addCase(visits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(newPatientVisit.pending, (state) => {
        state.loading = true;
        state.registrationError = null;
        state.registrationSuccess = null;
      })
      .addCase(newPatientVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.registrationSuccess = true;
      })
      .addCase(newPatientVisit.rejected, (state, action) => {
        state.loading = false;
        state.registrationSuccess = false;
        state.registrationError = action.payload || action.error.message;
      });
  },
});

// Export logout action for use in components
export const { resetErrors } = visitSlice.actions;

export default visitSlice.reducer;
