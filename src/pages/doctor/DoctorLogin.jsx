import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import axios from "axios";

import {
  signInStartD,
  signInSuccessD,
  signInFailureD,
} from "../../redux/doctor/doctorSlice.js";
import { useSelector, useDispatch } from "react-redux";
import OAuth from "../../component/google/OAuth.jsx";

export default function DoctorLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  
  const {
    currentDoctor,
    loading,
    error: errorMessage,
  } = useSelector((state) => state.doctor);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (currentDoctor) {
      navigate("/doctor", { replace: true }); // Redirect to home
    }
  }, [currentDoctor, navigate]);

  useEffect(() => {
    let timer;
    if (errorMessage) {
      timer = setTimeout(() => {
        dispatch(signInFailureD(null)); // Clear error message
        setErrors({});
      }, 10000); // Clear error after 10 seconds
    }
    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [errorMessage, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  /* const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    return newErrors;
  }; */
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const validationErrors = validate();
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }

    try {
      dispatch(signInStartD());
      const res = await axios.post("/api/doctor/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include this to send cookies
      });

      if (res.status !== 200 && res.status !== 201) {
        const errorMessage =
          res.data.message || "Something went wrong. Please try again.";
        dispatch(signInFailureD(errorMessage));
        return;
      }
      dispatch(signInSuccessD(res.data));
      navigate("/doctor");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      dispatch(signInFailureD(errorMessage));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/doctor" className="font-bold dark:text-white text-4xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 font-bold">
              Med
            </span>
            Doc
          </Link>
          <p className="text-sm mt-5">
            <span className="font-semibold">Welcome back, Doctor.</span> To
            access your dashboard, please{" "}
            <span className="font-semibold">log in</span> using your email and
            password. For added convenience, you can also use your{" "}
            <span className="font-semibold text-blue-500">Google account</span>{" "}
            for a quicker sign-in. Ensure your credentials are kept secure and
            up-to-date to provide the{" "}
            <span className="font-semibold">best care</span> to your patients.
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          {errorMessage && (
            <Alert className="mt-5" color={"failure"}>
              {errorMessage}
            </Alert>
          )}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="Enter your email address"
                id="email"
                onChange={handleChange}
                value={formData.email}
                // className={errors.email ? "border-red-500" : ""}
              />
              {/* {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )} */}
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="**********"
                id="password"
                onChange={handleChange}
                value={formData.password}
                // className={errors.password ? "border-red-500" : ""}
              />
              {/* {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )} */}
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
            <OAuth userType="doctor" />
          </form>
          <div className="flex justify-between">
            <div className="flex gap-2 text-xs mt-2">
              <span> Don't Have an account?</span>
              <Link to="/doctor/register" className="text-blue-500">
                Sign Up
              </Link>
            </div>

            <div className="flex gap-2 text-xs mt-2">
              <span> Forget your password?</span>
              <Link to="/doctor/forgot-password" className="text-blue-500">
                click here
              </Link>
            </div>
          </div>

          <div className="flex gap-2 text-sm justify-center mt-2">
            <span> Are you a patient?</span>
            <Link to="/signin" className="text-blue-500">
              sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
