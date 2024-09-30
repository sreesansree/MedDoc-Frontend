import React, { useState, useEffect } from "react";
import { Card, Badge, Button } from "flowbite-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  HiChartPie,
  HiUser,
  HiUserGroup,
  HiClipboardList,
} from "react-icons/hi";
import axios from "axios"; // Import axios for making API calls

export default function AdminHome() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPendings, setTotalPendings] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.includes("dashboard");

  // Fetch users and doctors when the component mounts
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const usersResponse = await axios.get("/api/admin/users", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include this to send cookies
        });
        const doctorsResponse = await axios.get("/api/admin/doctors", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include this to send cookies
        });
        const upcomingAppointments = await axios.get(
          "/api/admin/upcoming-slots",
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setTotalPendings(upcomingAppointments.data.length);
        setTotalUsers(usersResponse.data.length);
        setTotalDoctors(doctorsResponse.data.length);
      } catch (error) {
        console.error("Failed to fetch totals:", error);
      }
    };

    fetchTotals();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        {!isDashboard && (
          <Button
            gradientDuoTone="purpleToBlue"
            onClick={() => navigate("/admin/dashboard?tab=dashboard")}
          >
            Go to Dashboard
          </Button>
        )}
        <Button gradientDuoTone="purpleToBlue">Add New Department</Button>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center space-x-4">
          <HiUser className="text-3xl text-indigo-600" />
          <div>
            <h2 className="text-lg font-medium">Total Users</h2>
            <p className="text-2xl font-semibold">{totalUsers}</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <HiUserGroup className="text-3xl text-green-600" />
          <div>
            <h2 className="text-lg font-medium">Total Doctors</h2>
            <p className="text-2xl font-semibold">{totalDoctors}</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <HiClipboardList className="text-3xl text-yellow-600" />
          <div>
            <h2 className="text-lg font-medium">Pending Appointments</h2>
            <p className="text-2xl font-semibold">{totalPendings}</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <HiChartPie className="text-3xl text-red-600" />
          <div>
            <h2 className="text-lg font-medium">Revenue</h2>
            <p className="text-2xl font-semibold">₹ 0000</p>
          </div>
        </Card>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Activities</h2>
        <Card>
          <ul className="divide-y divide-gray-200">
            <li className="py-2 flex justify-between items-center">
              <span>
                New user registered: <strong>Yuvaraj Sigh</strong>
              </span>
              <Badge color="info">5 mins ago</Badge>
            </li>
            <li className="py-2 flex justify-between items-center">
              <span>
                New appointment booked by: <strong>Tovino</strong>
              </span>
              <Badge color="info">10 mins ago</Badge>
            </li>
            <li className="py-2 flex justify-between items-center">
              <span>
                Doctor <strong>Dr. Adams</strong> approved
              </span>
              <Badge color="success">1 hour ago</Badge>
            </li>
          </ul>
        </Card>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="flex gap-4">
          <Link to="/admin/dashboard?tab=users">
            <Button gradientDuoTone="cyanToBlue">View All Users</Button>
          </Link>
          <Link to="/admin/dashboard?tab=doctors">
            <Button gradientDuoTone="cyanToBlue">View All Doctors</Button>
          </Link>
          <Button gradientDuoTone="cyanToBlue">Manage Departments</Button>
          <Button gradientDuoTone="cyanToBlue">Check Appointments</Button>
        </div>
      </section>
    </div>
  );
}
