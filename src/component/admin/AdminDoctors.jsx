import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { GiCheckMark } from "react-icons/gi";
import ConfirmationModal from "../common/ConfirmationModal";
import api from "../../api/renderApi";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [actioinType, setActionType] = useState(""); // "block" or "unblock"

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/api/admin/doctors", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const approvedDoctors = response.data.filter(
        (doctor) => doctor.isApproved
      );
      setDoctors(approvedDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]); // Ensure it's an array even in case of error
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleBlock = async (id) => {
    try {
      await api.post(
        `/api/admin/block-doctor/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      fetchDoctors();
    } catch (error) {
      console.error("Error blocking doctor:", error);
    }
  };

  const handleUnblock = async (id) => {
    try {
      await api.post(
        `/api/admin/unblock-doctor/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      fetchDoctors();
    } catch (error) {
      console.error("Error unblocking doctor:", error);
    }
  };

  const openModal = (doctor, type) => {
    setSelectedDoctor(doctor);
    setActionType(type);
    setIsModalOpen(true);
  };

  const confirmAction = () => {
    if (actioinType === "block") {
      handleBlock(selectedDoctor._id);
    } else if (actioinType === "unblock") {
      handleUnblock(selectedDoctor._id);
    }
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
    setActionType("");
  };

  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const totalPages = Math.ceil(doctors.length / doctorsPerPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold my-4">Doctor Management</h2>
        <Link to="/admin/dashboard?tab=doctors/approve-management">
          <Button className="h-fit w-fit">Approval Management</Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200" hoverable>
          <Table.Head>
            <Table.HeadCell>Sl.no</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Profile Picture</Table.HeadCell>
            <Table.HeadCell>Verified</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {currentDoctors.length > 0 ? (
              currentDoctors.map((doctor, index) => (
                <Table.Row
                  key={doctor._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{doctor.name}</Table.Cell>
                  <Table.Cell>{doctor.email}</Table.Cell>
                  <Table.Cell>
                    <img
                      src={doctor.profilePicture}
                      alt="Profile"
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {doctor.isVerified ? (
                      <GiCheckMark className="text-green-500" />
                    ) : (
                      "No"
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      className={` ${
                        doctor.is_blocked ? "bg-green-500" : "bg-red-500"
                      } text-white w-20 px-2 py-1 rounded ml-2`}
                      // onClick={() =>
                      //   doctor.is_blocked
                      //     ? handleUnblock(doctor._id)
                      //     : handleBlock(doctor._id)
                      // }
                      onClick={() =>
                        openModal(
                          doctor,
                          doctor.is_blocked ? "unblock" : "block"
                        )
                      }
                    >
                      {doctor.is_blocked ? "Unblock" : "Block"}
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center">
                  No doctors found.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          {pageNumbers.map((number) => (
            <Button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`mx-1 ${
                currentPage === number ? "bg-blue-500 text-white" : ""
              }`}
            >
              {number}
            </Button>
          ))}
        </div>
      </div>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmAction}
        title={`Confirm ${
          actioinType === "block" ? "Block" : "Unblock"
        } Doctor`}
        message={`Are you sure ? you want to ${
          actioinType === "block" ? "block" : "unblock"
        } ${selectedDoctor?.name} ? `}
      />
    </div>
  );
}
