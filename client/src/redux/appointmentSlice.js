import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ENV Variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const appointmentSlots = createAsyncThunk(
  'appointment/appointmentSlots',
  async (_, { rejectWithValue, getState }) => {
    const { userData } = getState().auth;
    try {
      const response = await axios.get(`${API_BASE_URL}/today-appointments`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Retriving appointment list failed: ', error);
      return rejectWithValue(error.response?.data || 'Request failed due to an unexpected error.');
    }
  }
);

export const appointments = createAsyncThunk(
  'appointment/appointments',
  async ({ page, limit, date }, { rejectWithValue, getState }) => {
    const { userData } = getState().auth;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/appointments?page=${page}&limit=${limit}&date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Retriving appointments list failed: ', error);
      return rejectWithValue(error.response?.data || 'Request failed due to an unexpected error.');
    }
  }
);

export const appointmentByOldPatient = createAsyncThunk(
  'appointment/appointmentByOldPatient',
  async (data, { rejectWithValue, getState }) => {
    console.log(data);
    const { userData } = getState().auth;
    try {
      const response = await axios.post(
        `${API_BASE_URL}/appointmentByOldPatient/${data?.patientId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Registering appointment failed: ', error);
      return rejectWithValue(error.response?.data || 'Request failed due to an unexpected error.');
    }
  }
);

export const appointmentByNewPatient = createAsyncThunk(
  'appointment/appointmentByNewPatient',
  async (data, { rejectWithValue, getState }) => {
    const { userData } = getState().auth;
    try {
      const response = await axios.post(`${API_BASE_URL}/appointmentByNewPatient`, data, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Registering new patient appointment failed: ', error);
      return rejectWithValue(error.response?.data || 'Request failed due to an unexpected error.');
    }
  }
);

const initialState = {
  data: null,
  todayAppointments: null,
  appointmentList: null,
  loading: null,
  error: null,
  isSuccess: null,
  isFailed: null,
  isSubmitted: false,
  appointmentData: null,
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    reset(state) {
      state.error = null;
      state.isSuccess = null;
      state.isFailed = null;
    },
    resetAppointment(state) {
      state.appointmentData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(appointments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.appointmentList = null;
      })
      .addCase(appointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentList = action.payload;
      })
      .addCase(appointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(appointmentSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(appointmentSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.todayAppointments = action.payload;
      })
      .addCase(appointmentSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(appointmentByOldPatient.pending, (state) => {
        state.isSubmitted = true;
        state.isSuccess = null;
        state.isFailed = null;
      })
      .addCase(appointmentByOldPatient.fulfilled, (state, action) => {
        state.isSubmitted = false;
        state.isSuccess = true;
        state.appointmentData = action.payload;
      })
      .addCase(appointmentByOldPatient.rejected, (state, action) => {
        state.isSubmitted = false;
        state.isFailed = action.payload || action.error.message;
      })
      .addCase(appointmentByNewPatient.pending, (state) => {
        state.isSubmitted = true;
        state.isSuccess = null;
        state.isFailed = null;
      })
      .addCase(appointmentByNewPatient.fulfilled, (state, action) => {
        state.isSubmitted = false;
        state.isSuccess = true;
        state.appointmentData = action.payload;
      })
      .addCase(appointmentByNewPatient.rejected, (state, action) => {
        state.isSubmitted = false;
        state.isFailed = action.payload || action.error.message;
      });
  },
});

// Export actions for use in components
export const { reset, resetAppointment } = appointmentSlice.actions;

export default appointmentSlice.reducer;
