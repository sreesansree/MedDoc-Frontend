import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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

  return <div>DocDashboard</div>;
}
