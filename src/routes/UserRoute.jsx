import React from "react";
import { Routes, Route } from "react-router-dom";
// import UserHome from "../pages/user/UserHome";
// import UserSignIn from "../pages/user/UserSignIn";
// import UserSignUp from "../pages/user/UserSignUp";
// import UserOtp from "../pages/user/UserOtp";
import DoctorsList from "../pages/user/DoctorsList";
// import Header from "../component/user/Header";

import FooterCom from "../component/pageVerify/FooterCom";
import NavBar from "../component/pageVerify/NavBar";
import PrivateRoute from "../component/dashboard/PrivateRoute";
import NotFound from "../component/notFound/NotFound";
import DoctorDetails from "../component/user/DoctorDetails.jsx";
import PaymentPage from "../component/user/PaymentPage.jsx";

export default function UserRoute() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <NavBar />
          <Routes>
            {/* <Route path="" element={<UserHome />} />
        <Route path="login" element={<UserSignIn />} />
        <Route path="register" element={<UserSignUp />} />
        <Route path="verify-otp" element={<UserOtp />} /> */}
            <Route element={<PrivateRoute />}>
              <Route path="doctors-list" element={<DoctorsList />} />
              <Route path="doctor-detail/:id" element={<DoctorDetails />} />
              <Route path="/payment/:slotId" element={<PaymentPage />} />/
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <FooterCom />
      </div>
    </>
  );
}
