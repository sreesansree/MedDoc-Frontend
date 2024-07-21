import React from "react";
import { Route, Routes } from "react-router-dom";
import DocHeader from "../component/doctor/DocHeader";
import DocRegister from "../pages/doctor/DocRegister";
import DoctorLogin from "../pages/doctor/DoctorLogin";

export default function DoctorRoute() {
  return (
    <>
      <DocHeader />
      <Routes>
        <Route path="register" element={<DocRegister />} />
        <Route path="login" element={<DoctorLogin />} />
      </Routes>
    </>
  );
}
