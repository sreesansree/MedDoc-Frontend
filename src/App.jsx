import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoute from "./routes/UserRoute";
import AuthRoute from "./routes/AuthRoute";
import NotFound from "./component/notFound/NotFound";

export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/*" element={<AuthRoute />} />
          <Route path="/user/*" element={<UserRoute />} />
          <Route path="/admin/*" />
          <Route path="/doctor/*" />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}
