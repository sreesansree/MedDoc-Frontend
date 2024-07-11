import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./component/notFound/NotFound";
import {
  UserRoute,
  AdminRoute,
  AuthRoute,
  DoctorRoute,
} from "./routes/Routes.js";

export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/*" element={<AuthRoute />} />
          <Route path="/user/*" element={<UserRoute />} />
          <Route path="/admin/*" element={<AdminRoute />} />
          <Route path="/doctor/*" />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}
