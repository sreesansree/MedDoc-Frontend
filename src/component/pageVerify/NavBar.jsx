import { useState } from "react";
// import { useState, useEffect, useRef } from "react";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaBell } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice";
import { signOutSuccess } from "../../redux/user/userSlice";
import { markAllAsRead } from "../../redux/notification/notificationSlice";
import ChatNotification from "../common/ChatNotification";
import useSocket from "../../Hooks/useSocket";
import Swal from "sweetalert2";

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

  useSocket(currentUser?._id);

  const handleBellClick = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications && unreadCount > 0) {
      dispatch(markAllAsRead()); // Mark all notifications as read when opened
    }
  };

  const handleSignOut = async () => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Leaving so soon?",
      text: "Are you sure you want to log out?",
      icon: "question",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/3304/3304567.png",
      imageWidth: 80,
      imageHeight: 80,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
      background: theme === "dark" ? "#1f2937" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
    });

    // If user confirms, proceed with logout
    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/users/logout`, {
          method: "POST",
        });
        if (!res.ok) {
          const data = await res.json();
          console.log(data.message);
        } else {
          dispatch(signOutSuccess());
          // Show success message
          await Swal.fire({
            title: "Logged Out!",
            text: "You have been successfully logged out.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            background: theme === "dark" ? "#1f2937" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
          });
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error during sign out:", error);
        // Show error message
        Swal.fire({
          title: "Error!",
          text: "An error occurred while logging out.",
          icon: "error",
          background: theme === "dark" ? "#1f2937" : "#fff",
          color: theme === "dark" ? "#fff" : "#000",
        });
      }
    }
  };

  return (
    <Navbar className="fixed w-full top-0 z-50 border-b-2 self-center whitespace-nowrap text-sm sm:text-xl font font-semibold dark:text-white">
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
                  <ChatNotification
                    notifications={notifications}
                    userType="user"
                  />
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

        <Navbar.Link active={path === "/user/doctors-list"} as={"div"}>
          <Link to="/user/doctors-list">Doctors</Link>
        </Navbar.Link>

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
