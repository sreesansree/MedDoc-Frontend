import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Navbar, Badge } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaBell } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice";
import { signOutSuccessD } from "../../redux/doctor/doctorSlice";
// import NotificationComponent from "../common/NotificationComponent"; // Adjust the import path as necessary
import { markAllAsRead } from "../../redux/notification/notificationSlice";
import ChatNotification from "../common/ChatNotification";

export default function DocHeader() {
  const path = useLocation().pathname;
  const { currentDoctor } = useSelector((state) => state.doctor);

  // const [notifications, setNotifications] = useState([]);
  const { notifications, unreadCount } = useSelector(
    (state) => state.notifications
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationList, setNotificationList] = useState(notifications);

  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log("currentDoctor in Header:", currentDoctor);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    dispatch(markAllAsRead()); // Mark all notifications as read when opened
  };

  const handleRemoveNotification = (indexToRemove) => {
    const updatedNotifications = notificationList.filter(
      (notification, index) => index !== indexToRemove
    );
    setNotificationList(updatedNotifications); // Update the state with the new list
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
  // useEffect(() => {
  //   // Simulate receiving notifications
  //   setNotifications([
  //     { message: "New appointment reminder" },
  //     { message: "Upcoming appointment confirmation" },
  //   ]);
  // }, []);

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
            {/* Notification Icon with Badge */}
            {/* <div className="relative mt-3 mx-2 ">
              <FaBell
                className="text-xl cursor-pointer relative"
                onClick={() => setShowNotifications(!showNotifications)}
              />
              {notifications.length > 0 && !showNotifications && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white"></div>
              )}
              {showNotifications && (
                <NotificationComponent
                  userType="doctor"
                  setShowNotifications={setShowNotifications}
                  
                />
              )}
            </div> */}
            <div className="relative mt-3 mx-2">
              <FaBell
                className="text-xl cursor-pointer"
                onClick={handleNotificationClick}
              />
              {unreadCount > 0 && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-100 bg-white dark:bg-gray-700 border rounded-lg shadow-lg z-50">
                  <ChatNotification
                    notifications={notificationList} // Pass current notifications
                    removeNotification={handleRemoveNotification} // Pass removal function
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
                Profile
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
              <Navbar.Link active={path === "/doctor"} as={"div"}>
                <Link to="/doctor">Home</Link>
              </Navbar.Link>
              <Navbar.Link active={path === "/create-slot"} as={"div"}>
                <Link to="/doctor/create-slot">Create Slot</Link>
              </Navbar.Link>
              <Navbar.Link active={path === "/Slot-list"} as={"div"}>
                <Link to={`/doctor/slots/${currentDoctor._id}`}>Slot List</Link>
              </Navbar.Link>

              <Navbar.Link
                active={path === "/doctor/dashboard?tab=appointments"}
                as={"div"}
              >
                <Link to="/doctor/dashboard?tab=appointments">
                  Appointments
                </Link>
              </Navbar.Link>
              {/* <Navbar.Link active={path === "/messages"} as={"div"}>
                <Link to="/doctor/">Messages</Link>
              </Navbar.Link> */}
              {/* <Navbar.Link active={path === "/messages"} as={"div"}>
                <Link to="/doctor/">Notifications</Link>
              </Navbar.Link> */}
            </>
          )}
        </>
      </Navbar.Collapse>
    </Navbar>
  );
}
