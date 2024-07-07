import React from "react";
import { Button, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
export default function Header() {
  const path = useLocation().pathname;
  return (
    <Navbar className="border-b-2 self-center whitespace-nowrap text-sm sm:text-xl font font-semibold dark:text-white">
      <Link to="/">
        <span
          className="px-2 py-1 bg-gradient-to-r from-indigo-400
        via-purple-300 to-pink-400 rounded-lg text-white"
        >
          Med
        </span>
        Doc
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon />
        </Button>
        <Link to="/user/login">
          <Button gradientDuoTone="purpleToBlue" outline pill>
            Sign In
          </Button>
        </Link>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/user"} as={'div'}>
          <Link to="/user">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/user/doctors"} as={'div'}>
          <Link to="/user/doctors">Doctors</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/user/about"} as={'div'}>
          <Link to="/user/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/user/contact_us"} as={'div'}>
          <Link to="/user/contact_us">Contact Us</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
