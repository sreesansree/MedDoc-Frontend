import React, { useState } from "react";
import { Button, TextInput, Label, Alert } from "flowbite-react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import api from "../../api/renderApi.js";

const ForgetPassword = ({ userType }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // const endPoint =
      //   userType === "doctor"
      //     ? "/api/doctor/forget-password"
      //     : "/api/users/forget-password";
      let endPoint;
      if (userType === "doctor") {
        endPoint = "/api/doctor/forget-password";
      } else if (userType === "admin") {
        endPoint = "/api/admin/forget-password";
      } else {
        endPoint = "/api/users/forget-password";
      }
      const response = await api.post(endPoint, { email });
      setMessage(response.data.message);
      // Navigate to CompletePasswordReset with query parameters
      if (userType === "doctor") {
        navigate(`/doctor/reset-password?email=${email}&userType=${userType}`);
      } else if (userType === "admin") {
        navigate(`/admin/reset-password?email=${email}&userType=${userType}`);
      } else {
        navigate(`/reset-password?email=${email}&userType=${userType}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Request Password Reset</h1>
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
          <Label htmlFor="email">Email</Label>
          <TextInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Reset
        </Button>
      </form>
    </div>
  );
};

export default ForgetPassword;
