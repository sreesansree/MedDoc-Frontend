import React from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="">
      <AdminSidebar />
      <main>{children}</main>
    </div>
  );
}
