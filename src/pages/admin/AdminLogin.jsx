import React, { useEffect, useState } from "react";
import { Button, Spinner, TextInput, Label } from "flowbite-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  signInStartA,
  signInFailureA,
  signInSuccessA,
  resetLoading,
} from "../../redux/admin/adminSlice.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const {
    currentAdmin,
    loading,
    error: errorMessage,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    if (currentAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [currentAdmin, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      // return setErrorMessage("Please fill out all fields.");
      dispatch(signInFailureA("Please fill out all fields."));
      toast.error("fill out all fields", {
        onClose: () => dispatch(resetLoading()),
      });
      return;
    }
    try {
      dispatch(signInStartA());
      // console.log(formData, "formData");
      const response = await axios.post("/api/admin/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include this to send cookies
      });
      // console.log(response.data, "responseee");
      // console.log(response.data.message);

      // Check for success status
      if (response.status !== 200 && response.status !== 201) {
        dispatch(
          signInFailureA(
            data.message || "Something went wrong. Please try again."
          )
        );
        // setLoading(false);
        return;
      }
      dispatch(signInSuccessA(response.data));
      toast.success("Login successful!", {
        onClose: () => dispatch(resetLoading()),
      });
      navigate("/admin");
    } catch (error) {
      dispatch(signInFailureA(error?.response?.data?.message));

      toast.error(error?.response?.data?.message, {
        onClose: () => dispatch(resetLoading()),
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-800 ">
      <div className="w-full max-w-md p-8 space-y-3 bg-white rounded shadow-md">
        <h2 className="text-xl font-bold text-cyan-900 text-center">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="">
            <Label
              className="dark:text-slate-900 mv-10"
              htmlFor="email"
              value="Email"
            />
            <TextInput
              id="email"
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
            />
          </div>
          <div>
            <Label
              className="dark:text-slate-900 mv-10"
              htmlFor="password"
              value="Password"
            />
            <TextInput
              id="password"
              type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
            />
          </div>
          <Button type="submit" className="w-full">
            {loading ? (
              <>
                <Spinner size="sm" light={true} />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
        {errorMessage && (
          <div className="text-sm text-red-500 mt-2">{errorMessage}</div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}
