import React from "react";
import { AdminHome, AdminLogin, AdminDashboard } from "../pages/admin/index";
import { Routes, Route } from "react-router-dom";
import AdminAuth from "../component/Auth/AdminAuth";
import AdminHeader from "../component/admin/adminHeader";
import NotFound from "../component/notFound/NotFound";

export default function AdminRoute() {
  return (
    <>
      <AdminHeader />
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route element={<AdminAuth />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="/" element={<AdminHome />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
