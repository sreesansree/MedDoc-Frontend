// redux/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [], // Array to hold notifications
  unreadCount: 0, // Count of unread notifications
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
      state.unreadCount += 1;
    },
    markAllAsRead: (state) => {
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      state.notifications.splice(action.payload, 1);
    },
  },
});

export const { addNotification, markAllAsRead, removeNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
