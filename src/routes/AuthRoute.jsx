import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "../component/pageVerify/SignUp";
import Landingpage from "../component/landingPage/Landingpage";
import NavBar from "../component/pageVerify/NavBar";
import OTP from "../component/pageVerify/OTP";
import FooterCom from "../component/pageVerify/FooterCom";
import SignIn from "../component/pageVerify/SignIn";
import About from "../pages/About";
import Contact from "../pages/Contact";


function AuthRoute() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="signup" element={<SignUp />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="verify_otp" element={<OTP />} />
        <Route path="" element={<Landingpage />} />
        <Route path="about" element={<About />} />
        <Route path="contact_us" element={<Contact />} />
      </Routes>
      <FooterCom />
    </>
  );
}

export default AuthRoute;
