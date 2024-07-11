import React from "react";
import { AdminHome, AdminLogin } from "../pages/admin/index";
import { Routes, Route } from "react-router-dom";

export default function AdminRoute() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/home" element={<AdminHome />} />
      </Routes>
    </>
  );
}
