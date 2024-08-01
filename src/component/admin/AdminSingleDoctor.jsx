import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "flowbite-react";

export default function AdminSingleDoctor({ doctorId }) {
  const [doctor, setDoctor] = useState(null);
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDoctor = async () => {
    try {
      const response = await axios.get(`/api/admin/doctors/${doctorId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setDoctor(response.data);
      fetchDepartment(response.data.department);
    } catch (error) {
      console.error("Error fetching doctor:", error);
      setLoading(false);
    }
  };

  const fetchDepartment = async (departmentId) => {
    try {
      const response = await axios.get(
        `/api/admin/departments/${departmentId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setDepartment(response.data.name);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching department:", error);
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await axios.post(
        `/api/admin/approve-doctor/${doctorId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      fetchDoctor(); // Refresh doctor details after approval
    } catch (error) {
      console.error("Error approving doctor:", error);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error loading doctor details
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold my-4">Doctor Details</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <p className="text-lg font-medium">
            <strong>Name:</strong> {doctor.name}
          </p>
          <p className="text-lg font-medium">
            <strong>Email:</strong> {doctor.email}
          </p>
          <p className="text-lg font-medium">
            <strong>Verified:</strong> {doctor.isVerified ? "Yes" : "No"}
          </p>
          <p className="text-lg font-medium">
            <strong>Approved:</strong> {doctor.isApproved ? "Yes" : "No"}
          </p>
          <p className="text-lg font-medium">
            <strong>Blocked:</strong> {doctor.is_blocked ? "Yes" : "No"}
          </p>
          <p className="text-lg font-medium">
            <strong>Department:</strong> {department || "N/A"}
          </p>
          <div className="text-lg font-medium">
            <strong>Certificate:</strong>
            {doctor.certificate ? (
              <img
                src={doctor.certificate}
                alt="Doctor Certificate"
                className="mt-2 w-64 h-auto"
              />
            ) : (
              "No certificate available"
            )}
          </div>
        </div>
        {/* {!doctor.isApproved && ( */}
        <Button onClick={handleApprove} className="mt-4">
          {doctor.isApproved ? "Approved" : "Approve"}
        </Button>
        {/* )} */}
      </div>
    </div>
  );
}
