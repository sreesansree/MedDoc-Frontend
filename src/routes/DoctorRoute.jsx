import React from "react";
import { Route, Routes } from "react-router-dom";
import DocHeader from "../component/doctor/DocHeader";
import DocRegister from "../pages/doctor/DocRegister";
import DoctorLogin from "../pages/doctor/DoctorLogin";
import DocOTP from "../pages/doctor/DocOtp";
import DocHome from "../pages/doctor/DocHome";
import FooterCom from "../component/pageVerify/FooterCom";
import DoctorAuth from "../component/Auth/DoctorAuth";
import ForgetPassword from "../component/common/ForgetPassword";
import CompletePasswordReset from "../component/common/CompletePasswordReset";
import NotFound from "../component/notFound/NotFound";
import DocDashboard from "../pages/doctor/DocDashboard";
import CreateSlot from "../component/doctor/CreateSlot";
import SlotList from "../component/doctor/SlotList";
import ChatPage from "../pages/chat/ChatPage";
import ReminderNotification from "../component/common/Reminder/ReminderNotification";
import ReminderListener from "../component/common/Reminder/ReminderListener";
import DocAppointmentDetails from "../component/doctor/DocAppointmentDetails";

export default function DoctorRoute() {
  const userType = "doctor";
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <DocHeader />
          <ReminderListener userType={userType} />
          <ReminderNotification />
          <Routes>
            <Route path="register" element={<DocRegister />} />
            <Route path="login" element={<DoctorLogin />} />
            <Route path="verify-otp" element={<DocOTP />} />
            <Route
              path="forgot-password"
              element={<ForgetPassword userType="doctor" />}
            />
            <Route
              path="reset-password"
              element={<CompletePasswordReset userType="doctor" />}
            />
            <Route element={<DoctorAuth />}>
              <Route path="create-slot" element={<CreateSlot />} />
              <Route path="slots/:id" element={<SlotList />} />
              <Route path="dashboard" element={<DocDashboard />} />
              {/* <Route path="chat" element={<ChatPage userType="doctor" />} /> */}
              <Route
                path="chat/:receiverId"
                element={<ChatPage userType="doctor" />}
              />
              <Route path="" element={<DocHome />} />
              <Route
                path="/appointments/:id"
                element={<DocAppointmentDetails />}
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
