import { createSlice } from "@reduxjs/toolkit";

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
      // localStorage.setItem("adminInfo", JSON.stringify(action.payload));
    },
    signInFailureA: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOutSuccessA: (state) => {
      state.currentAdmin = null;
      state.error = null;
      state.loading = false;
      // localStorage.removeItem("adminInfo");
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
