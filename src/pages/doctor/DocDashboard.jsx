import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DocSideBar from "../../component/doctor/DocSideBar";
import DocProfile from "../../component/doctor/DocProfile";

export default function DocDashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DocSideBar />
      </div>
      {/* Profile*/}
      {tab === "profile" && <DocProfile />}
    </div>
  );
}
