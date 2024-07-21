import React from "react";
import { Route, Routes } from "react-router-dom";
import DocHeader from "../component/doctor/DocHeader";
import DocRegister from "../pages/doctor/DocRegister";
import DoctorLogin from "../pages/doctor/DoctorLogin";
import DocOTP from "../pages/doctor/DocOtp";
import DocHome from "../pages/doctor/DocHome";
import FooterCom from "../component/pageVerify/FooterCom";
import DoctorAuth from "../component/Auth/DoctorAuth";

export default function DoctorRoute() {
  return (
    <>
      <DocHeader />
      <Routes>
        <Route path="register" element={<DocRegister />} />
        <Route path="login" element={<DoctorLogin />} />
        <Route path="verify-otp" element={<DocOTP />} />
        <Route element={<DoctorAuth />}>
          <Route path="" element={<DocHome />} />
        </Route>
      </Routes>
      <FooterCom />
    </>
  );
}
