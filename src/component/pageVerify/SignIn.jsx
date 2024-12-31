import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  // FloatingLabel,
  Button,
  Label,
  Spinner,
  TextInput,
} from "flowbite-react";
// import axios from "axios";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice.js";
// import {
//   signInStartD,
//   signInSuccessD,
//   signInFailureD,
//   signOutSuccessD,
// } from "../../redux/doctor/doctorSlice.js";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import OAuth from "../google/OAuth.jsx";
import api from "../../api/renderApi.js";

export default function SignIn() {
  // const [role, setRole] = useState("user");
  const [formData, setFromData] = useState({ email: "", password: "" });
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [loading, setLoading] = useState(false);
  const {
    currentUser,
    loading,
    error: errorMessage,
  } = useSelector((state) => state.user);
  // const doctorLoginSlice = useSelector((state) => state.doctor);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const userInfo = useSelector((state) => state.user); // Adjust based on your state slice

  useEffect(() => {
    if (currentUser) {
      navigate("/", { replace: true }); // Redirect to home
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    let timer;
    if (errorMessage) {
      timer = setTimeout(() => {
        dispatch(signInFailure(null)); // Clear error message
        // setErrors({});
      }, 8000); // Clear error after 8 seconds
    }
    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [errorMessage, dispatch]);

  const handleChange = (e) => {
    // console.log(e.target.value);
    setFromData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form data being sent:", formData);
    if (!formData.email || !formData.password) {
      // return setErrorMessage("Please fill out all fields.");
      return dispatch(signInFailure("Please fill out all fields."));
    }
    try {
      dispatch(signInStart());
      const res = await api.post("api/users/login", formData);

      // Check for success status
      if (res.status !== 200 && res.status !== 201) {
        dispatch(
          signInFailure(
            res.message || "Something went wrong. Please try again."
          )
        );

        // setLoading(false);
        return;
      }

      // If registration is successful, navigate to the OTP verification page
      // setLoading(false);
      dispatch(signInSuccess(res.data));
      navigate("/");
    } catch (error) {
      // setErrorMessage(error.response?.data?.message || error.message);
      // setLoading(false);
      dispatch(signInFailure(error.response?.data?.message || error.message));
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400
    via-purple-500 to-pink-500 font-bold"
            >
              Med
            </span>
            Doc
          </Link>
          <p className="text-sm mt-5">
            Consult your doctor . You can sign In with your email and password
            or with Google.
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
            <Label value="Email" />
            {/* <div> */}
            <TextInput
              type="email"
              placeholder="Enter your email address"
              id="email"
              onChange={handleChange}
            />
            {/* </div> */}
            <Label value="Password" />
            <div className="relative">
              <TextInput
                type={showPassword ? "text" : "password"}
                placeholder="**********"
                id="password"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("currentPassword")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
            <Button
              gradientDuoTone={"purpleToPink"}
              type="submit"
              outline
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth userType="user" />
          </form>
          <div className="flex justify-between">
            <div className="flex gap-2 text-xs mt-2">
              <span> Don't Have an account?</span>
              <Link to="/signup" className="text-blue-500">
                Sign Up
              </Link>
            </div>
            <span>|</span>
            <div className="flex gap-2 text-xs mt-2">
              <span> Forget your password?</span>
              <Link to="/forgot-password" className="text-blue-500">
                click here
              </Link>
            </div>
          </div>

          <div className="flex justify-center gap-2 text-sm  mt-2">
            <span> Are you a doctor?</span>
            <Link to="/doctor/login" className="text-blue-500">
              sign in here
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color={"failure"}>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
