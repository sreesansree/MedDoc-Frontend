import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, TextInput, Spinner } from "flowbite-react";
import axios from "axios";

export default function OTP() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const navigate = useNavigate();

  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [resendTimer]);

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/users/resend-otp",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage("OTP has been resent to your email.");
      setResendTimer(60);
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "api/users//verify-otp",
        { email, otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = res.data;
      if (res.status !== 200 && res.status !== 201) {
        setErrorMessage(data.message || "Invalid OTP. Please try again.");
        setLoading(false);
        return;
      }
      setSuccessMessage("OTP verified successfully!");
      setLoading(false);
      navigate("/signin");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
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
            Please enter the OTP sent to your email to verify your account.
          </p>
        </div>

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleVerifyOtp}>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
              />
            </div>
            <div>
              <Label value="OTP" />
              <TextInput
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.trim())}
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
                  <span className="pl-3">Verifying...</span>
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            {resendTimer > 0 ? (
              <span>Resend OTP in {resendTimer} seconds</span>
            ) : (
              <Button
                gradientDuoTone={"purpleToPink"}
                onClick={handleResendOtp}
                outline
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Resending...</span>
                  </>
                ) : (
                  "Resend OTP"
                )}
              </Button>
            )}
          </div>
          {errorMessage && (
            <Alert className="mt-5" color={"failure"}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert className="mt-5" color={"success"}>
              {successMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
