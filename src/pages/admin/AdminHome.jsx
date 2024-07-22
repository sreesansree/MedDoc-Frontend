import React from "react";
import { Card, Badge, Button } from "flowbite-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HiChartPie,
  HiUser,
  HiUserGroup,
  HiClipboardList,
} from "react-icons/hi";

export default function AdminHomeContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.includes("dashboard");
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
            <p className="text-2xl font-semibold">1,234</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <HiUserGroup className="text-3xl text-green-600" />
          <div>
            <h2 className="text-lg font-medium">Total Doctors</h2>
            <p className="text-2xl font-semibold">567</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <HiClipboardList className="text-3xl text-yellow-600" />
          <div>
            <h2 className="text-lg font-medium">Pending Appointments</h2>
            <p className="text-2xl font-semibold">45</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <HiChartPie className="text-3xl text-red-600" />
          <div>
            <h2 className="text-lg font-medium">Revenue</h2>
            <p className="text-2xl font-semibold">₹ 12,345</p>
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
          <Button gradientDuoTone="cyanToBlue">View All Users</Button>
          <Button gradientDuoTone="cyanToBlue">View All Doctors</Button>
          <Button gradientDuoTone="cyanToBlue">Manage Departments</Button>
          <Button gradientDuoTone="cyanToBlue">Check Appointments</Button>
        </div>
      </section>
    </div>
  );
}