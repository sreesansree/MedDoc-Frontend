import React from "react";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice";
import { signOutSuccessA } from "../../redux/admin/adminSlice";

export default function AdminHeader() {
  const path = useLocation().pathname;
  const { currentAdmin } = useSelector((state) => state.admin);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const res = await fetch(`api/admin/logout`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(data.message);
    } else {
      dispatch(signOutSuccessA());
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <Navbar className="border-b-2 self-center whitespace-nowrap text-sm sm:text-xl font font-semibold dark:text-white">
      <Link to="/admin">
        <span
          className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400
    via-purple-500 to-pink-500 font-bold"
        >
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
        {currentAdmin ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentAdmin?.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentAdmin?.name}</span>
              <span className="block text-sm font-medium truncate">
                {currentAdmin?.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => navigate("/admin/dashboard?tab=profile")}>
              Profile
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/admin/login">
            <Button gradientDuoTone="purpleToBlue" outline pill>
              Sign In
            </Button>
          </Link>
        )}
      </div>

      <Navbar.Toggle />
      <Navbar.Collapse>
        {!path.startsWith("/admin") && (
          <ul className="md:gap-6 md:flex md:space-x-6 md:space-y-0 md:mt-0 md:text-sm md:font-medium">
            <li>
              <Link
                className={`${
                  path === "/admin/dashboard?tab=dashboard"
                    ? "bg-gray-100 md:bg-transparent md:text-blue-700 md:p-0"
                    : "bg-blue-700 md:bg-transparent md:text-blue-700 md:p-0"
                } block py-2 pr-4 pl-3 rounded md:bg-transparent hover:bg-gray-100 md:p-0`}
                to="/admin/dashboard?tab=dashboard"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                className={`${
                  path === "/admin/dashboard?tab=department"
                    ? "bg-gray-100 md:bg-transparent md:text-blue-700 md:p-0"
                    : "bg-blue-700 md:bg-transparent md:text-blue-700 md:p-0"
                } block py-2 pr-4 pl-3 rounded md:bg-transparent hover:bg-gray-100 md:p-0`}
                to="/admin/dashboard?tab=department"
              >
                Department
              </Link>
            </li>
            <li>
              <Link
                className={`${
                  path === "/admin/dashboard?tab=doctors"
                    ? "bg-gray-100 md:bg-transparent md:text-blue-700 md:p-0"
                    : "bg-blue-700 md:bg-transparent md:text-blue-700 md:p-0"
                } block py-2 pr-4 pl-3 rounded md:bg-transparent hover:bg-gray-100 md:p-0`}
                to="/admin/dashboard?tab=doctors"
              >
                Doctors
              </Link>
            </li>
            <li>
              <Link
                className={`${
                  path === "/admin/dashboard?tab=users"
                    ? "bg-gray-100 md:bg-transparent md:text-blue-700 md:p-0"
                    : "bg-blue-700 md:bg-transparent md:text-blue-700 md:p-0"
                } block py-2 pr-4 pl-3 rounded md:bg-transparent hover:bg-gray-100 md:p-0`}
                to="/admin/dashboard?tab=users"
              >
                Users
              </Link>
            </li>
          </ul>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
