import React, { useState, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiUser } from "react-icons/hi";
import { FaUserDoctor } from "react-icons/fa6";
import { FcDepartment } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { signOutSuccessA } from "../../redux/admin/adminSlice";

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
      const res = await axios.post("/api/admin/logout");
      console.log(res, "response");
      if (res.status !== 200) {
        console.log(res.data.message);
      } else {
        dispatch(signOutSuccessA());
        navigate("/admin/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/admin?tab=admin">
            <Sidebar.Item active={tab === "admin"} icon={HiChartPie} as="div">
              Dashboard
            </Sidebar.Item>
          </Link>
          <Link to="/admin?tab=department">
            <Sidebar.Item
              active={tab === "department"}
              icon={FcDepartment}
              as="div"
            >
              Departments
            </Sidebar.Item>
          </Link>
          <Link to="/admin?tab=doctors">
            <Sidebar.Item
              active={tab === "doctors"}
              icon={FaUserDoctor}
              as="div"
            >
              Doctors
            </Sidebar.Item>
          </Link>
          <Link to="/admin?tab=users">
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
