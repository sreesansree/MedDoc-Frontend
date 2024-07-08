import React, { useState } from "react";
import {
  Alert,
  // FloatingLabel,
  Button,
  Label,
  Spinner,
  TextInput,
} from "flowbite-react";

import { Link, useNavigate } from "react-router-dom";
export default function UserSignUp() {
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
            Consult your doctor . You can sign up with your email and password
            or with Google.
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="User name" />
              <TextInput
                type="text"
                placeholder="Enter your name"
                id="username"
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
                type="text"
                placeholder="Enter your mobile number"
                id="mobile"
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
            <Button gradientDuoTone={"purpleToPink"} type="submit" outline>
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to={"/user/login"} className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
