import { createSlice } from "@reduxjs/toolkit";

const reminderSlice = createSlice({
  name: "reminder",
  initialState: [],
  reducers: {
    addReminder: (state, action) => {
      state.push(action.payload);
    },
    cleanReminder: (state) => {
      return [];
    },
  },
});

export const { addReminder, cleanReminder } = reminderSlice.actions;
export default reminderSlice.reducer;
