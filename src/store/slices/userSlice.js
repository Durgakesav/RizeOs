import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'users/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user profile');
    }
  }
);

export const followUser = createAsyncThunk(
  'users/followUser',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.post(`${API_URL}/users/${userId}/follow`, {}, config);
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to follow user');
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'users/unfollowUser',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.delete(`${API_URL}/users/${userId}/follow`, config);
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to unfollow user');
    }
  }
);

export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async (searchParams, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(searchParams);
      const response = await axios.get(`${API_URL}/users/search?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to search users');
    }
  }
);

export const fetchNetworkUsers = createAsyncThunk(
  'users/fetchNetworkUsers',
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_URL}/users/suggestions?${params}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch network users');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'users/updateProfile',
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.put(`${API_URL}/auth/profile`, profileData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update profile');
    }
  }
);

const initialState = {
  currentProfile: null,
  searchResults: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProfile: (state) => {
      state.currentProfile = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload.user;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Follow User
      .addCase(followUser.fulfilled, (state, action) => {
        if (state.currentProfile && state.currentProfile._id === action.payload.userId) {
          state.currentProfile.followerCount = action.payload.followerCount;
        }
      })
      // Unfollow User
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (state.currentProfile && state.currentProfile._id === action.payload.userId) {
          state.currentProfile.followerCount = action.payload.followerCount;
        }
      })
      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.users;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Network Users
      .addCase(fetchNetworkUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNetworkUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.users;
      })
      .addCase(fetchNetworkUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentProfile, clearSearchResults } = userSlice.actions;
export default userSlice.reducer; 