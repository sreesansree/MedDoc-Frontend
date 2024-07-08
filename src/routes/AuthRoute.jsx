import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "../component/pageVerify/SignUp";
import Landingpage from "../component/landingPage/Landingpage";
import NavBar from "../component/pageVerify/NavBar";
import OTP from "../component/pageVerify/OTP";
import FooterCom from "../component/pageVerify/FooterCom";
import SignIn from "../component/pageVerify/SignIn";

function AuthRoute() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="signup" element={<SignUp />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="verify_otp" element={<OTP />} />
        <Route path="" element={<Landingpage />} />
      </Routes>
      <FooterCom />
    </>
  );
}

export default AuthRoute;
