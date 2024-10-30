import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ENV Variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const users = createAsyncThunk('user/users', async (_, { rejectWithValue, getState }) => {
  const { userData } = getState().auth;
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Retriving users list failed: ', error);
    return rejectWithValue(error.response?.data || 'Request failed due to an unexpected error.');
  }
});

const initialState = {
  data: null,
  loading: null,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(users.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(users.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(users.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

// Export logout action for use in components
export default userSlice.reducer;
