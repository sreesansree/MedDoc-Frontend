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
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "../component/dashboard/PrivateRoute";
import ForgetPassword from "../component/common/ForgetPassword";
import CompletePasswordReset from "../component/common/CompletePasswordReset";

function AuthRoute() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="" element={<Landingpage />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="verify_otp" element={<OTP />} />
        <Route
          path="forgot-password"
          element={<ForgetPassword userType="user" />}
        />
        <Route
          path="reset-password"
          element={<CompletePasswordReset userType="user" />}
        />
        <Route path="about" element={<About />} />
        <Route path="contact_us" element={<Contact />} />
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <FooterCom />
    </>
  );
}

export default AuthRoute;
