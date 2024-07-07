import React from "react";
import { Routes, Route } from "react-router-dom";
import UserHome from "../pages/user/UserHome";
import UserSignIn from "../pages/user/UserSignIn";
import UserSignUp from "../pages/user/UserSignUp";
import UserOtp from "../pages/user/UserOtp";
import DoctorsList from "../pages/user/DoctorsList";
import Header from "../component/user/Header";

export default function UserRoute() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="" element={<UserHome />} />
        <Route path="login" element={<UserSignIn />} />
        <Route path="register" element={<UserSignUp />} />
        <Route path="verify-otp" element={<UserOtp />} />
        <Route path="doctors-list" element={<DoctorsList />} />
      </Routes>
    </>
  );
}
