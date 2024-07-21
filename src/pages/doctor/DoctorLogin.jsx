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
import axios from "axios";

import {
  signInStartD,
  signInSuccessD,
  signInFailureD,
} from "../../redux/doctor/doctorSlice.js";
import { useSelector, useDispatch } from "react-redux";
// import OAuth from "../google/OAuth.jsx";

export default function DoctorLogin() {
  const [formData, setFromData] = useState({ email: "", password: "" });

  const {
    currentDoctor,
    loading,
    error: errorMessage,
  } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const userInfo = useSelector((state) => state.user); // Adjust based on your state slice

  useEffect(() => {
    if (currentDoctor) {
      navigate("/doctor", { replace: true }); // Redirect to home
    }
  }, [currentDoctor, navigate]);

  const handleChange = (e) => {
    // console.log(e.target.value);
    setFromData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form data being sent:", formData);
    if (!formData.email || !formData.password) {
      // return setErrorMessage("Please fill out all fields.");
      return dispatch(signInFailureD("Please fill out all fields."));
    }
    try {
      dispatch(signInStartD());
      const res = await axios.post("/api/doctor/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include this to send cookies
      });

      // Check for success status
      if (res.status !== 200 && res.status !== 201) {
        dispatch(
          signInFailureD(
            data.message || "Something went wrong. Please try again."
          )
        );

        // setLoading(false);
        return;
      }

      // If registration is successful, navigate to the OTP verification page
      // setLoading(false);
      dispatch(signInSuccessD(res.data));
      navigate("/doctor");
    } catch (error) {
      // setErrorMessage(error.response?.data?.message || error.message);
      // setLoading(false);
      dispatch(signInFailureD(error.response?.data?.message || error.message));
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/doctor" className="font-bold dark:text-white text-4xl">
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
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="Enter your email address"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="**********"
                id="password"
                onChange={handleChange}
              />
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
            {/* <OAuth /> */}
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
              <Link to="/signup" className="text-blue-500">
                click here
              </Link>
            </div>
          </div>

          <div className="flex gap-2 text-xs justify-center mt-2">
            <span> Are you a patient?</span>
            <Link to="/signin" className="text-blue-500">
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
