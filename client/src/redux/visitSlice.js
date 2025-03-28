import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ENV Variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const visits = createAsyncThunk(
  'visit/visits',
  async ({ page, limit, date }, { rejectWithValue, getState }) => {
    const { userData } = getState().auth;
    console.log(`${API_BASE_URL}/visits?page=${page}&limit=${limit}&date=${date}`);
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

export const newVisit = createAsyncThunk(
  'visit/newVisit',
  async (data, { rejectWithValue, getState }) => {
    const { userData } = getState().auth;
    try {
      const response = await axios.post(
        `${API_BASE_URL}/newPatientVisit/${data?.patientId}`,
        data?.visitInfo,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create new visit record: ', error);
      return rejectWithValue(error.response?.data || 'Request failed due to an unexpected error.');
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  visitList: [],
  newPatientVisit: null,
  isSuccess: null,
  isFailed: null,
};

const visitSlice = createSlice({
  name: 'visit',
  initialState,
  reducers: {
    reset(state) {
      state.error = null;
      state.isSuccess = null;
      state.isFailed = null;
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
      .addCase(newVisit.pending, (state) => {
        state.loading = true;
        state.isSuccess = null;
        state.isFailed = null;
      })
      .addCase(newVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.newPatientVisit = action.payload;
      })
      .addCase(newVisit.rejected, (state, action) => {
        state.loading = false;
        state.isFailed = action.payload || action.error.message;
      });
  },
});

// Export logout action for use in components
export const { reset } = visitSlice.actions;

export default visitSlice.reducer;
