// redux/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [], 
    currentChat: null,
    isChatOpen: false,
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
    openChat(state, action) {
      state.isChatOpen = action.payload;
    },
    closeChat(state, action) {
      state.isChatOpen = action.payload;
    },
  },
});

export const {
  setMessages,
  addMessage,
  setCurrentChat,
  setNewMessageNotification,
  openChat,
  closeChat,
} = chatSlice.actions;
export default chatSlice.reducer;
