import React, { useState, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiUser } from "react-icons/hi";
import { FaUserDoctor } from "react-icons/fa6";
import { FcDepartment } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import axios from "axios";
import { signOutSuccessA } from "../../redux/admin/adminSlice";
import api from "../../api/renderApi.js";

export default function AdminSidebar() {
  const [tab, setTab] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await api.post(
        "/api/admin/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );

      if (res.status !== 200) {
        console.error("Sign out failed:", res.data.message || "Unknown error");
        return;
      }

      dispatch(signOutSuccessA());
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <Sidebar className="w-full md:w-56 ">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1 ">
          <Link to="/admin/dashboard?tab=dashboard">
            <Sidebar.Item active={tab === "admin"} icon={HiChartPie} as="div">
              Dashboard
            </Sidebar.Item>
          </Link>
          <Link to="/admin/dashboard?tab=department">
            <Sidebar.Item
              active={tab === "department"}
              icon={FcDepartment}
              as="div"
            >
              Departments
            </Sidebar.Item>
          </Link>
          <Link to="/admin/dashboard?tab=doctors">
            <Sidebar.Item
              active={tab === "doctors"}
              icon={FaUserDoctor}
              as="div"
            >
              Doctors
            </Sidebar.Item>
          </Link>
          <Link to="/admin/dashboard?tab=users">
            <Sidebar.Item active={tab === "users"} icon={HiUser} as="div">
              Users
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            onClick={handleSignOut}
            className="cursor-pointer"
            icon={HiArrowSmRight}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
