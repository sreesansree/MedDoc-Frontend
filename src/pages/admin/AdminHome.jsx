import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "flowbite-react";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
console.log(req.cookies.admintoken,'admintom');
  useEffect(() => {
    const verifyCookie = async () => {
      console.log(cookies.token,'tokeen')
      console.log(cookies.admintoken,'adminTokeen.')
      if (!cookies.token) {
        navigate("/admin/login");
      }
      const { data } = await axios.post("api/admin/home",
        { withCredentials: true }
      );
      console.log(data,'dataaaaaaaa');
      const { status, admin } = data;
      setUsername(admin);
      return status
        ? toast(`Hello ${admin}`, {
            position: "top-right",
          })
        : (removeCookie("admintoken"), navigate("admin/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const Logout = () => {
    removeCookie("admintoken");
    navigate("/signup");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h4 className="text-2xl font-bold mb-4">
            Welcome <span className="text-blue-600">{username}</span>
          </h4>
          <Button onClick={Logout} className="w-full">
            LOGOUT
          </Button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
