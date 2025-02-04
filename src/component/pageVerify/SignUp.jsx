import React, { useState } from "react";
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
import OAuth from "../google/OAuth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import api from "../../api/renderApi.js";
export default function SignUp() {
  const [formData, setFromData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    // console.log(e.target.value);
    setFromData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form data being sent:", formData);
    if (
      !formData.name ||
      !formData.email ||
      !formData.mobile ||
      !formData.password
    ) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await api.post("api/users/register", formData);

      // Check for success status
      if (res.status !== 200 && res.status !== 201) {
        setErrorMessage(
          res.message || "Something went wrong. Please try again."
        );
        setLoading(false);
        return;
      }

      // If registration is successful, navigate to the OTP verification page
      setLoading(false);
      navigate("/verify_otp");
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
            Consult your doctor . You can sign up with your email and password
            or with Google.
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="name" />
              <TextInput
                type="text"
                placeholder="Enter your name"
                id="name"
                onChange={handleChange}
              />
            </div>

            {/* Floating label
             <div>
              <FloatingLabel
                type="text"
                variant="outlined"
                label="User Name"
                id="username"
                onChange={handleChange}
              />
            </div> */}

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
              <Label value="Mobile" />
              <TextInput
                type="Number"
                placeholder="Enter your mobile number"
                id="mobile"
                onChange={handleChange}
              />
            </div>
            <Label value="Password" />
            <div className="relative">
              <TextInput
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
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
                "Sign Up"
              )}
            </Button>
            <OAuth userType="user" />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to={"/signin"} className="text-blue-500">
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
