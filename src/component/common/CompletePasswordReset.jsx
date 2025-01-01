import React, { useState } from "react";
import { Button, TextInput, Label, Alert } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
import api from "../../api/renderApi.js";

const CompletePasswordReset = ({ userType }) => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // const endPoint =
      //   userType === "doctor"
      //     ? "/api/doctor/reset-password"
      //     : "/api/users/reset-password";
      let endPoint;
      if (userType === "doctor") {
        endPoint = "/api/doctor/reset-password";
      } else if (userType === "admin") {
        endPoint = "/api/admin/reset-password";
      } else {
        endPoint = "/api/users/reset-password";
      }
      const response = await api.post(endPoint, {
        email,
        otp: otp,
        password,
      });
      if (userType === "user") {
        setMessage(response.data.message);
        navigate("/signin");
      } else if (userType === "doctor") {
        setMessage(response.data.message);
        navigate("/doctor/login");
      } else {
        setMessage(response.data.message);
        navigate("/admin/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Complete Password Reset</h1>
      {message && (
        <Alert color="success" onDismiss={() => setMessage("")}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert color="failure" onDismiss={() => setError("")}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="otp">OTP</Label>
          <TextInput
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">New Password</Label>
          <TextInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <TextInput
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default CompletePasswordReset;
