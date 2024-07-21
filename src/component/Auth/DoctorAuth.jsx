import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
const DoctorAuth = () => {
  const { currentDoctor } = useSelector((state) => state.doctor);
  return currentDoctor ? <Outlet /> : <Navigate to="/doctor/login" />;
};

export default DoctorAuth;
