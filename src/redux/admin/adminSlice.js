import { createSlice } from "@reduxjs/toolkit";
import { signOutSuccess } from "../user/userSlice";

const initialState = {
  currentAdmin: null,
  error: null,
  loading: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    signInStartA: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccessA: (state, action) => {
      state.currentAdmin = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailureA: (state) => {
      state.currentAdmin = null;
      state.error = null;
    },
    signOutSuccessA: (state) => {
      (state.currentAdmin = null), (state.error = null);
      state.loading = false;
    },
    resetLoading: (state) => {
      state.loading = false;
    },
  },
});

export const {
  signInStartA,
  signInSuccessA,
  signInFailureA,
  signOutSuccessA,
  resetLoading,
} = adminSlice.actions;

export default adminSlice.reducer;
