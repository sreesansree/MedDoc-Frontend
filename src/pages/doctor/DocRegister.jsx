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
// import OAuth from "../google/OAuth";

export default function DocRegister() {
  const [formData, setFromData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  //   const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // clear the error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    // console.log(e.target.value);
    setFromData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form data being sent:", formData);
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage("Please fill out all fields.");
      toast.error("fill out all fields.");
      return;
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      console.log(formData,'formdata');
      const res = await axios.post("/api/doctor/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res,'res');
      // Check for success status
      if (res.status !== 200 && res.status !== 201) {
        setErrorMessage(
          data.message || "Something went wrong. Please try again."
        );
        setLoading(false);
        return;
      }

      // If registration is successful, navigate to the OTP verification page
      setLoading(false);
      navigate("/doctor/verify-otp");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setLoading(false);
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
            Register as a doctor to provide consultations and manage
            appointments. Sign up with your email and password.
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
            <h1 className="text-lg font-bold text-center">Doctor Register</h1>
            <div>
              <Label value="name" />
              <TextInput
                type="text"
                placeholder="Enter your name"
                id="name"
                onChange={handleChange}
              />
            </div>
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
                placeholder="Password"
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
                "Sign Up"
              )}
            </Button>
            {/* <OAuth /> */}
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to={"/doctor/login"} className="text-blue-500">
              Sign In
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
