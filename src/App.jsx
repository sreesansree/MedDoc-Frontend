import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./component/notFound/NotFound";
import {
  UserRoute,
  AdminRoute,
  AuthRoute,
  DoctorRoute,
} from "./routes/Routes.js";
import Loader from "./loader/Loader.jsx";
import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  },[]);// Add empty dependency array to avoid infinite loop
  
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <Router>
            <Routes>
              <Route path="/user/*" element={<UserRoute />} />
              <Route path="/admin/*" element={<AdminRoute />} />
              <Route path="/doctor/*" element={<DoctorRoute />} />
              <Route path="/*" element={<AuthRoute />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          {/* <ToastContainer /> */}
        </div>
      )}
    </>
  );
}
