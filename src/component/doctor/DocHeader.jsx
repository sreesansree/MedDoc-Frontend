import React from "react";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice";
import { signOutSuccessD } from "../../redux/doctor/doctorSlice";

export default function DocHeader() {
  const path = useLocation().pathname;
  const { currentDoctor } = useSelector((state) => state.doctor);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("currentDoctor:", currentDoctor);
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
                <Link to="/doctor/slots/:doctorId">Slot List</Link>
              </Navbar.Link>

              <Navbar.Link active={path === "/appointments"} as={"div"}>
                <Link to="/doctor/">Appointments</Link>
              </Navbar.Link>
              <Navbar.Link active={path === "/messages"} as={"div"}>
                <Link to="/doctor/">Messages</Link>
              </Navbar.Link>
              <Navbar.Link active={path === "/messages"} as={"div"}>
                <Link to="/doctor/">Notifications</Link>
              </Navbar.Link>
            </>
          )}
        </>
      </Navbar.Collapse>
    </Navbar>
  );
}
