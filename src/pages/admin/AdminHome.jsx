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
import { Pie, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default function AdminHome() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPendings, setTotalPendings] = useState(0);

  const [totalApprovedDoctors, setTotalApprovedDoctors] = useState(0);
  const [totalCanceledAppointments, setTotalCanceledAppointments] = useState(0);
  const [totalCompletedAppointments, setTotalCompletedAppointments] =
    useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState({});
  const [recentActivities, setRecentActivities] = useState([]); // New state for activities

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
        const appointmentsResponse = await axios.get(
          "/api/admin/all-appointments",
          { withCredentials: true }
        );
        const responseData = appointmentsResponse.data;
        const completedAppointments = responseData.filter((data) => {
          return data.status === "completed";
        });

        const canceledAppointments = responseData.filter((data) => {
          return data.status === "canceled";
        });

        const docData = doctorsResponse.data;
        const approvedDoctors = docData.filter((data) => data.isApproved);

        // Fetch recent activities
        const activitiesResponse = await axios.get("/api/admin/activities", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setRecentActivities(activitiesResponse.data);

        setTotalPendings(upcomingAppointments.data.length);
        setTotalUsers(usersResponse.data.length);
        setTotalDoctors(doctorsResponse.data.length);

        setTotalApprovedDoctors(approvedDoctors.length);
        setTotalCanceledAppointments(canceledAppointments.length);
        setTotalCompletedAppointments(completedAppointments.length);

        // Calculate total revenue from completed appointments
        const revenue = completedAppointments.reduce((acc, appointment) => {
          return acc + (appointment.price || 0); // Ensure price is defined
        }, 0);
        setTotalRevenue(revenue);

        // Calculate Monthly Revenue
        const revenueByMonth = completedAppointments.reduce(
          (acc, appointment) => {
            const date = new Date(appointment.date);
            const month = date.toLocaleString("default", { month: "long" });
            const year = date.getFullYear();
            const key = `${month} ${year}`;

            // Accumulate revenue by month and year
            acc[key] = (acc[key] || 0) + (appointment.price || 0);
            return acc;
          },
          {}
        );

        setMonthlyRevenue(revenueByMonth);
      } catch (error) {
        console.error("Failed to fetch totals:", error);
      }
    };

    fetchTotals();
  }, []);

  // Data for Pie Chart (Users and Doctors)
  const pieData = {
    labels: ["Total Users", "Approved Doctors", "Not Approved Doctors"],
    datasets: [
      {
        data: [
          totalUsers,
          totalApprovedDoctors,
          totalDoctors - totalApprovedDoctors,
        ],
        backgroundColor: ["#4CAF50", "#2196F3", "#FF5722"],
      },
    ],
  };

  // Data for Doughnut Chart (Appointments Status)
  const doughnutData = {
    labels: [
      "Completed Appointments",
      "Pending Appointments",
      "Canceled Appointments",
    ],
    datasets: [
      {
        data: [
          totalCompletedAppointments,
          totalPendings,
          totalCanceledAppointments,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        // backgroundColor: ["#4CAF50", "#36A2EB", "#FF6384"],
      },
    ],
  };

  // Generate labels and data for Bar Chart
  const barLabels = Object.keys(monthlyRevenue);
  const barDataValues = Object.values(monthlyRevenue);

  const lineData = {
    labels: barLabels,
    datasets: [
      {
        label: "Monthly Revenue",
        data: barDataValues,
        backgroundColor: "#4CAF50",
        borderColor: "#4CAF50",
        fill: false,
      },
    ],
  };

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
            <h2 className="text-lg font-medium">Total Revenue</h2>
            <p className="text-2xl font-semibold">₹ {totalRevenue}</p>
          </div>
        </Card>
      </section>

      {/* Chart */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Charts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <h3 className="text-lg font-semibold mb-2">
              Users & Doctors Overview
            </h3>
            <Pie data={pieData} />
          </Card>
          <Card>
            <h3 className="text-lg font-semibold mb-2">
              Appointments Overview
            </h3>
            <Doughnut data={doughnutData} />
          </Card>
          <Card>
            <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
            <Line data={lineData} options={{ tension: 0.4 }} />
          </Card>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Average Revenue per Appointment */}
          <Card className="flex items-center space-x-4">
            <HiChartPie className="text-3xl text-blue-600" />
            <div>
              <h2 className="text-lg font-medium">
                Avg Revenue per Appointment
              </h2>
              <p className="text-2xl font-semibold">
                ₹ {(totalRevenue / totalCompletedAppointments).toFixed(2) || 0}
              </p>
            </div>
          </Card>

          {/* Monthly Growth in Users */}
          <Card className="flex items-center space-x-4">
            <HiUser className="text-3xl text-purple-600" />
            <div>
              <h2 className="text-lg font-medium">Monthly User Growth</h2>
              <p className="text-2xl font-semibold">12%</p>{" "}
              {/* Example value */}
            </div>
          </Card>

          {/* Most Active Doctor */}
          <Card className="flex items-center space-x-4">
            <HiUserGroup className="text-3xl text-green-600" />
            <div>
              <h2 className="text-lg font-medium">Most Active Doctor</h2>
              <p className="text-2xl font-semibold">Dr. John Doe</p>{" "}
              {/* Example value */}
            </div>
          </Card>

          {/* Top Performing Department */}
          <Card className="flex items-center space-x-4">
            <HiClipboardList className="text-3xl text-orange-600" />
            <div>
              <h2 className="text-lg font-medium">Top Department</h2>
              <p className="text-2xl font-semibold">Cardiology</p>{" "}
              {/* Example value */}
            </div>
          </Card>
        </div>
        {/* Activity */}
        {/* Breakdown of Weekly Activity */}
        <h2 className="text-xl font-semibold mt-6">Weekly Activity Summary</h2>
        <Card>
          <ul className="divide-y divide-gray-200">
            <li className="py-2 flex justify-between items-center">
              <span>
                Appointments this week: <strong>50</strong>
              </span>
            </li>
            <li className="py-2 flex justify-between items-center">
              <span>
                New users this week: <strong>20</strong>
              </span>
            </li>
            <li className="py-2 flex justify-between items-center">
              <span>
                New doctors approved this week: <strong>5</strong>
              </span>
            </li>
          </ul>
        </Card>

        {/* Revenue Comparison */}
        <h2 className="text-xl font-semibold mt-6">
          Monthly Revenue Comparison
        </h2>
        <Card>
          <div>
            <p className="text-lg">
              Revenue this month compared to last month:{" "}
              <strong className="text-green-600">+15%</strong>{" "}
              {/* Example value */}
            </p>
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
        // Render the activities
<Card>
  <ul className="divide-y divide-gray-200">
    {recentActivities.map((activity) => (
      <li key={activity._id} className="py-2 flex justify-between items-center">
        <span>
          {activity.description}: <strong>{activity.name}</strong>
        </span>
        <Badge color={activity.type === 'user_registered' ? 'info' : 'success'}>
          {new Date(activity.createdAt).toLocaleString()} {/* Adjust time format as necessary */}
        </Badge>
      </li>
    ))}
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
