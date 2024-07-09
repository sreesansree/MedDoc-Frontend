import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../component/dashboard/DashSideBar";
import DashProfile from "../component/dashboard/DashProfile";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    // console.log(tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }

  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Side bar */}
        <DashSideBar />
      </div>

      {/* Profile.... */}
      {tab === "profile" && <DashProfile />}
    </div>
  );
}
