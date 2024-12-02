import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaBell } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice";
import { signOutSuccessD } from "../../redux/doctor/doctorSlice";
import ChatNotification from "../common/ChatNotification";
import { markAllAsRead } from "../../redux/notification/notificationSlice";
import useSocket from "../../Hooks/useSocket";

export default function DocHeader() {
  const path = useLocation().pathname;
  const { currentDoctor } = useSelector((state) => state.doctor);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount } = useSelector(
    (state) => state.notifications
  );
  const [showNotifications, setShowNotifications] = useState(false);

  useSocket(currentDoctor?._id);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      dispatch(markAllAsRead()); // Mark all notifications as read when opened
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/doctor/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent with the request
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Sign out failed:", data.message || "Unknown error");
        return;
      }

      dispatch(signOutSuccessD());
      navigate("/doctor/login", { replace: true });
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <Navbar
      className={`border-b-2 self-center whitespace-nowrap text-sm sm:text-xl font font-semibold ${
        theme === "dark"
          ? "bg-gray-900 dark:border-gray-700 dark:text-white"
          : "bg-white dark:bg-gray-800"
      }`}
    >
      <Link to="/doctor">
        <span
          className={`bg-clip-text text-transparent ${
            theme === "dark"
              ? "bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"
              : "bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600"
          } font-bold`}
        >
          Med
        </span>
        Doc
      </Link>

      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color={theme === "dark" ? "gray" : "gray"}
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? (
            <FaSun className="text-yellow-400" />
          ) : (
            <FaMoon className="text-gray-400" />
          )}
        </Button>
        {currentDoctor ? (
          <>
            <div className="relative mt-3 mx-2">
              <FaBell
                className="text-xl cursor-pointer"
                onClick={handleBellClick}
              />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-2">
                  {unreadCount}
                </span>
              )}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-100 bg-white shadow-lg rounded-lg p-2 z-10">
                  <h3 className="text-sm font-bold">Notifications</h3>
                  <ChatNotification
                    notifications={notifications}
                    userType="doctor"
                  />
                </div>
              )}
            </div>

            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="doctor"
                  img={currentDoctor?.profilePicture}
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentDoctor?.name}</span>
                <span className="block text-sm font-medium truncate">
                  {currentDoctor?.email}
                </span>
              </Dropdown.Header>
              <Dropdown.Item
                onClick={() => navigate("/doctor/dashboard?tab=profile")}
              >
                My Profile
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => navigate("/doctor/dashboard?tab=appointments")}
              >
                My Appointment
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
            </Dropdown>
          </>
        ) : (
          <Link to="/doctor/login">
            <Button gradientDuoTone="purpleToBlue" outline pill>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <>
          {currentDoctor && (
            <>
              <Navbar.Link as={"div"}>
                <Link
                  to="/doctor"
                  className={`${
                    path === "/doctor"
                      ? "text-indigo-600 font-semibold" // Active styles
                      : "text-gray-700 dark:text-gray-300" // Inactive styles
                  }`}
                >
                  Home
                </Link>
              </Navbar.Link>

              <Navbar.Link as={"div"}>
                <Link
                  to="/doctor/create-slot"
                  className={`${
                    path === "/doctor/create-slot"
                      ? "text-indigo-600 font-semibold" // Active styles
                      : "text-gray-700 dark:text-gray-300" // Inactive styles
                  }`}
                >
                  Create Slot
                </Link>
              </Navbar.Link>

              <Navbar.Link as={"div"}>
                <Link
                  to={`/doctor/slots/${currentDoctor._id}`}
                  className={`${
                    path === `/doctor/slots/${currentDoctor._id}`
                      ? "text-indigo-600 font-semibold" // Active styles
                      : "text-gray-700 dark:text-gray-300" // Inactive styles
                  }`}
                >
                  Slot List
                </Link>
              </Navbar.Link>

              {/* <Navbar.Link as={"div"}>
                <Link
                  to="/doctor/dashboard?tab=appointments"
                  className={`${
                    path === "/doctor/dashboard?tab=appointments"
                      ? "text-indigo-600 font-semibold;" // Active styles
                      : "text-gray-700 dark:text-gray-300" // Inactive styles
                  }`}
                >
                  Appointments
                </Link>
              </Navbar.Link> */}
            </>
          )}
        </>
      </Navbar.Collapse>
    </Navbar>
  );
}
