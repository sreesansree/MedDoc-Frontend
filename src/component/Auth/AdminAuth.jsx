import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function AdminAuth() {
  const { currentAdmin } = useSelector((state) => state.admin);
  console.log(currentAdmin,'Current Admin from Auth')

  return currentAdmin ? <Outlet /> : <Navigate to="login" replace />;
}
