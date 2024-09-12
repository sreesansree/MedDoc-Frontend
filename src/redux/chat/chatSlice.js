// redux/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    currentChat: null,
    newMessageNotification: null,
  },
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    setCurrentChat(state, action) {
      state.currentChat = action.payload;
    },
    setNewMessageNotification(state, action) {
      state.newMessageNotification = action.payload;
    },
  },
});

export const {
  setMessages,
  addMessage,
  setCurrentChat,
  setNewMessageNotification,
} = chatSlice.actions;
export default chatSlice.reducer;
