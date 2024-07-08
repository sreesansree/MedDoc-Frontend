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
import axios from "axios";

export default function SignIn() {
  const [formData, setFromData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    // console.log(e.target.value);
    setFromData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form data being sent:", formData);
    if (
      !formData.email ||
      !formData.password
    ) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await axios.post("api/users/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

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
      navigate("/user/userhome");
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
              className="px-2 py-1 bg-gradient-to-r from-indigo-500
        via-purple-500 to-pink-500 rounded-lg text-white"
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
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span> Don't Have an account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
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