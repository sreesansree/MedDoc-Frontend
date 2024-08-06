import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../../component/admin/AdminSidebar";
import AdminDashProfile from "../../component/admin/AdminDashProfile";
import AdminHome from "../admin/AdminHome";
import AdminDepartments from "../../component/admin/AdminDepartment";
import AdminDoctors from "../../component/admin/AdminDoctors";
import AdminUsers from "../../component/admin/AdminUsers";
import AdminSingleDoctor from "../../component/admin/AdminSingleDoctor";
import AdminDoctorApproval from "../../component/admin/AdminDoctorApproval";

export default function AdminDashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const matchDoctorId = tab.match(/^doctor\/(.+)$/);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <AdminSidebar />
      </div>
      <div className="flex-1 p-4">
        {tab === "dashboard" && <AdminHome />}
        {tab === "profile" && <AdminDashProfile />}
        {tab === "department" && <AdminDepartments />}
        {tab === "doctors" && <AdminDoctors />}
        {tab === "doctors/approve-management" && <AdminDoctorApproval />}
        {tab === "users" && <AdminUsers />}
        {matchDoctorId && <AdminSingleDoctor doctorId={matchDoctorId[1]} />}
      </div>
    </div>
  );
}
