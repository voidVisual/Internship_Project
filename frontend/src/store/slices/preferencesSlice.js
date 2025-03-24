import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const updatePreferences = createAsyncThunk(
  'preferences/updatePreferences',
  async (preferences) => {
    const response = await axios.patch(`${API_URL}/api/auth/preferences`, preferences);
    return response.data;
  }
);

const initialState = {
  darkMode: localStorage.getItem('darkMode') === 'true',
  emailNotifications: true,
  mailNotifications: true,
  loading: false,
  error: null
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
    toggleEmailNotifications: (state) => {
      state.emailNotifications = !state.emailNotifications;
    },
    toggleMailNotifications: (state) => {
      state.mailNotifications = !state.mailNotifications;
    },
    setPreferences: (state, action) => {
      return { ...state, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updatePreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const {
  toggleDarkMode,
  toggleEmailNotifications,
  toggleMailNotifications,
  setPreferences
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
