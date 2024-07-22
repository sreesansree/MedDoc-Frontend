import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "flowbite-react";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  console.log(doctors, "dpctorsssssss");

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("/api/admin/doctors", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include this to send cookies
      });
      console.log(response.data, "doctors data");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]); // Ensure it's an array even in case of error
    }
  };
 
  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(`/api/admin/approve-doctor/${id}`, {}, {
        withCredentials: true,
      });
      fetchDoctors(); 
    } catch (error) {
      console.error("Error approving doctor:", error);
    }
  };
  
  const handleBlock = async (id) => {
    try {
      await axios.post(`/api/admin/block-doctor/${id}`, {}, {
        withCredentials: true,
      });
      fetchDoctors(); 
    } catch (error) {
      console.error("Error blocking doctor:", error);
    }
  };
  
  const handleUnblock = async (id) => {
    try {
      await axios.post(`/api/admin/unblock-doctor/${id}`, {}, {
        withCredentials: true,
      });
      fetchDoctors(); 
    } catch (error) {
      console.error("Error unblocking doctor:", error);
    }
  };
  

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold my-4">Admin Doctors List</h2>
      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200" hoverable>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Verified</Table.HeadCell>
            <Table.HeadCell>Approved</Table.HeadCell>
            <Table.HeadCell>Blocked</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {Array.isArray(doctors) && doctors.length > 0 ? (
              doctors.map((doctor) => (
                <Table.Row
                  key={doctor._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{doctor.name}</Table.Cell>
                  <Table.Cell>{doctor.email}</Table.Cell>
                  <Table.Cell>{doctor.isVerified ? "Yes" : "No"}</Table.Cell>
                  <Table.Cell>{doctor.isApproved ? "Yes" : "No"}</Table.Cell>
                  <Table.Cell>{doctor.is_blocked ? "Yes" : "No"}</Table.Cell>
                  <Table.Cell>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleApprove(doctor._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                      onClick={() => handleBlock(doctor._id)}
                    >
                      Block
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
                      onClick={() => handleUnblock(doctor._id)}
                    >
                      Unblock
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={6} className="text-center">
                  No doctors found.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
