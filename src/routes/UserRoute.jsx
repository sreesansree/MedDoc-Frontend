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
import CalendarView from "../component/calenderView/CalenderView.jsx";
import ReminderNotification from "../component/common/Reminder/ReminderNotification.jsx";
import ReminderListener from "../component/common/Reminder/ReminderListener.jsx";
import AppointmentDetails from "../component/dashboard/AppointmentDetails.jsx";
import ReschedulePage from "../pages/user/ReschedulePage.jsx";

export default function UserRoute() {
  const userType = "user"; // Define the user type for the UserRoute

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <NavBar />
          <ReminderListener userType={userType} />
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route
                path="reminder-notification"
                element={<ReminderNotification />}
              />
              <Route path="doctors-list" element={<DoctorsList />} />
              <Route path="doctor-detail/:id" element={<DoctorDetails />} />
              <Route path="/payment/:slotId" element={<PaymentPage />} />
              {/* <Route path="chat" element={<ChatPage userType="user" />} /> */}
              <Route
                /*   path="chat/:doctorId/:appointmentId"*/
                path="chat/:receiverId"
                element={<ChatPage userType="user" />}
              />
              <Route path="calender" element={<CalendarView />} />
              <Route
                path="/appointments/:id"
                element={<AppointmentDetails />}
              />
              <Route
                path="/reschedule/:appointmentId"
                element={<ReschedulePage />}
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <FooterCom />
      </div>
    </>
  );
}
