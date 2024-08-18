import React from "react";
import { Routes, Route } from "react-router-dom";
import DoctorsList from "../pages/user/DoctorsList";

import FooterCom from "../component/pageVerify/FooterCom";
import NavBar from "../component/pageVerify/NavBar";
import PrivateRoute from "../component/dashboard/PrivateRoute";
import NotFound from "../component/notFound/NotFound";
import DoctorDetails from "../component/user/DoctorDetails.jsx";
import PaymentPage from "../component/user/PaymentPage.jsx";
import ChatPage from "../pages/chat/ChatPage.jsx";

export default function UserRoute() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <NavBar />
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="doctors-list" element={<DoctorsList />} />
              <Route path="doctor-detail/:id" element={<DoctorDetails />} />
              <Route path="/payment/:slotId" element={<PaymentPage />} />
              <Route path="chat" element={<ChatPage userType="user" />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <FooterCom />
      </div>
    </>
  );
}
