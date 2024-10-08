import React, { useState, useEffect, useRef } from "react";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaBell } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice";
import { signOutSuccess } from "../../redux/user/userSlice";
import {
  markAllAsRead,
  addNotification,
} from "../../redux/notification/notificationSlice";
import ChatNotification from "../common/ChatNotification";
import { io } from "socket.io-client";

// const socket = useRef();
const socket = io("http://localhost:5000"); // Replace with your backend URL

export default function NavBar() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount } = useSelector(
    (state) => state.notifications
  );
  const [showNotifications, setShowNotifications] = useState(false);
  console.log("notification from navBAr", notifications);

  useEffect(() => {
    // Listening for incoming notifications
    socket.on("getNotification", (notification) => {
      dispatch(addNotification(notification)); // Dispatch the notification to the Redux store
    });

    socket.on("getStoredNotifications", (storedNotifications) => {
      storedNotifications.forEach((notification) => {
        dispatch(addNotification(notification)); // Add each notification to Redux store
      });
    });

    return () => {
      socket.off("getNotification"); // Clean up socket listener on component unmount
      socket.off("getStoredNotifications");
    };
  }, [dispatch]);
  // Handle notification dropdown toggle

  const handleBellClick = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) {
      dispatch(markAllAsRead()); // Mark all notifications as read when opened
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/users/logout`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <Navbar className="border-b-2 self-center whitespace-nowrap text-sm sm:text-xl font font-semibold dark:text-white">
      <Link to="/">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 font-bold">
          Med
        </span>
        Doc
      </Link>

      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
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
                <div className="absolute right-0  mt-2 w-100 bg-white dark:bg-gray-600 shadow-lg rounded-lg p-2 z-10 ">
                  <h3 className="text-sm font-bold">Notifications</h3>
                  <ChatNotification notifications={notifications} />
                </div>
              )}
            </div>

            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="user" img={currentUser?.profilePicture} rounded />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser?.name}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser?.email}
                </span>
              </Dropdown.Header>
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>My Profile</Dropdown.Item>
              </Link>
              <Link to={"/dashboard?tab=appointments"}>
                <Dropdown.Item>My Appointment</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
            </Dropdown>
          </>
        ) : (
          <Link to="/signin">
            <Button gradientDuoTone="purpleToBlue" outline pill>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        {currentUser && (
          <>
            <Navbar.Link active={path === "/user/doctors-list"} as={"div"}>
              <Link to="/user/doctors-list">Doctors</Link>
            </Navbar.Link>

            {/* <Navbar.Link
              active={path === "/dashboard?tab=appointments"}
              as={"div"}
            >
              <Link to="/dashboard?tab=appointments">Appointments</Link>
            </Navbar.Link> */}
          </>
        )}
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/contact_us"} as={"div"}>
          <Link to="/contact_us">Contact Us</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
