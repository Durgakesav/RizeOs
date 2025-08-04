import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_URL}/notifications?${params}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch notifications');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, config);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to mark notification as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.put(`${API_URL}/notifications/read-all`, {}, config);
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to mark all notifications as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete(`${API_URL}/notifications/${notificationId}`, config);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete notification');
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  'notifications/getUnreadCount',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get(`${API_URL}/notifications/unread-count`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get unread count');
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: {
    current: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  },
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark as Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n._id === action.payload);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark All as Read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.read = true;
        });
        state.unreadCount = 0;
      })
      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (notification) => notification._id !== action.payload
        );
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      // Get Unread Count
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.unreadCount;
      });
  },
});

export const { clearError, clearNotifications, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer; 