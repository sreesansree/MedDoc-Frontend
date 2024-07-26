import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminSingleDoctor({ doctorId }) {
  const [doctor, setDoctor] = useState(null);
  // console.log(doctorId, "docId");
  // console.log(doctor,'doctor')
  const fetchDoctor = async () => {
    try {
      const response = await axios.get(`/api/admin/doctors/${doctorId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include this to send cookies
      });
      // console.log(response.data);
      setDoctor(response.data);
    } catch (error) {
      console.error("Error fetching doctor:", error);
      setDoctor(null); // Ensure it's null even in case of error
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold my-4">Doctor Details</h2>
      <div className="bg-white p-4 rounded shadow-md">
        <p>
          <strong>Name:</strong> {doctor?.name}
        </p>
        <p>
          <strong>Email:</strong> {doctor.email}
        </p>
        <p>
          <strong>Verified:</strong> {doctor.isVerified ? "Yes" : "No"}
        </p>
        <p>
          <strong>Approved:</strong> {doctor.isApproved ? "Yes" : "No"}
        </p>
        <p>
          <strong>Blocked:</strong> {doctor.is_blocked ? "Yes" : "No"}
        </p>
        {/* Add more doctor details as needed */}
      </div>
    </div>
  );
}
