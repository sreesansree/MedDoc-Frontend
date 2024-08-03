import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentDoctor: null,
  error: null,
  loading: false,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    signInStartD: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccessD: (state, action) => {
      state.currentDoctor = action.payload;
      state.loading = false;
      state.error = null;
      // localStorage.setItem("doctorInfo", JSON.stringify(action.payload));
    },
    signInFailureD: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOutSuccessD: (state) => {
      state.currentDoctor = null;
      state.error = null;
      state.loading = false;
      // localStorage.removeItem("doctorInfo");
    },
    updateStartD: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccessD: (state, action) => {
      state.currentDoctor = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailureD: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStartD,
  signInSuccessD,
  signInFailureD,
  signOutSuccessD,
  updateStartD,
  updateSuccessD,
  updateFailureD,
} = doctorSlice.actions;

export default doctorSlice.reducer;
