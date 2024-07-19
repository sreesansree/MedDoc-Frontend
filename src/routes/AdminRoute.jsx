import React from "react";
import { AdminHome, AdminLogin } from "../pages/admin/index";
import { Routes, Route } from "react-router-dom";
import AdminAuth from "../component/Auth/AdminAuth";

export default function AdminRoute() {
  return (
    <>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route element={<AdminAuth />}>
          <Route path="" element={<AdminHome />} />
        </Route>
      </Routes>
    </>
  );
}
