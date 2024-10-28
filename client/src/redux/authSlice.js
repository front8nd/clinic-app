import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ENV Variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login Failed:', error);
    return rejectWithValue(error.response?.data || 'Login failed due to an unexpected error.');
  }
});

export const register = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, credentials);
      return response.data;
    } catch (error) {
      console.error('Registration Failed:', error);
      return rejectWithValue(
        error.response?.data || 'Registration failed due to an unexpected error.'
      );
    }
  }
);

// Get Data from LocalStorage
const userData = localStorage.getItem('userData');
const parsedUserData = userData ? JSON.parse(userData) : null;

const initialState = {
  isAuthenticated: !!parsedUserData,
  userData: parsedUserData,
  loading: false,
  error: null,
  registrationSuccess: null,
  registrationError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.userData = null;
      localStorage.removeItem('userData');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userData = action.payload;
        localStorage.setItem('userData', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.registrationError = null;
        state.registrationSuccess = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registrationSuccess = true;
        state.loading = false;
        console.log(action.payload);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.registrationSuccess = false;
        state.registrationError = action.payload || action.error.message;
      });
  },
});

// Export logout action for use in components
export const { logout } = authSlice.actions;
export default authSlice.reducer;
