import React, { useState } from "react";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaBell } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice";
import { signOutSuccess } from "../../redux/user/userSlice";
// import NotificationComponent from "../common/NotificationComponent"; // Adjust the import path as necessary
import { markAllAsRead } from "../../redux/notification/notificationSlice";
import ChatNotification from "../common/ChatNotification";

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
  const [notificationList, setNotificationList] = useState(notifications);

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
            {/* Notification Icon with Badge */}
            {/* <div className="relative mt-3 mx-3">
              <FaBell
                className="text-xl cursor-pointer"
                onClick={() => setShowNotifications(!showNotifications)}
              />
              {showNotifications && (
                <NotificationComponent
                  userType="user"
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
                <div className="absolute right-0 mt-2 w-1000 dark:bg-slate-700 bg-white border rounded-lg shadow-lg z-50">
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
                <Dropdown.Item>Profile</Dropdown.Item>
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
            <Navbar.Link active={path === "/user/doctors"} as={"div"}>
              <Link to="/user/doctors-list">Doctors</Link>
            </Navbar.Link>

            <Navbar.Link active={path === "/user/doctors"} as={"div"}>
              <Link to="/dashboard?tab=appointments">Appointments</Link>
            </Navbar.Link>
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
