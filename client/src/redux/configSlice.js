import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ENV Variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const configData = createAsyncThunk(
  'config/configData',
  async (_, { rejectWithValue, getState }) => {
    const { userData } = getState().auth;
    try {
      const response = await axios.get(`${API_BASE_URL}/config`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Retriving Data failed: ', error);
      return rejectWithValue(error.response?.data || 'Request failed due to an unexpected error.');
    }
  }
);
export const updateConfigData = createAsyncThunk(
  'config/updateConfigData',
  async (data, { rejectWithValue, getState }) => {
    const { userData } = getState().auth;
    try {
      const response = await axios.put(`${API_BASE_URL}/config`, data, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Updating Data failed: ', error);
      return rejectWithValue(error.response?.data || 'Request failed due to an unexpected error.');
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  configDetails: null,
  isSuccess: null,
  isFailed: null,
};

const configSlice = createSlice({
  name: 'config',
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
      .addCase(configData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(configData.fulfilled, (state, action) => {
        state.loading = false;
        state.configDetails = action.payload;
      })
      .addCase(configData.rejected, (state, action) => {
        state.loading = false;
        state.configDetails = action.payload || action.error.message;
      })
      .addCase(updateConfigData.pending, (state) => {
        state.loading = true;
        state.isSuccess = null;
        state.isFailed = null;
      })
      .addCase(updateConfigData.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(updateConfigData.rejected, (state, action) => {
        state.loading = false;
        state.isFailed = action.payload || action.error.message;
      });
  },
});

// Export logout action for use in components
export const { reset } = configSlice.actions;

export default configSlice.reducer;
