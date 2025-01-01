import React, { useEffect, useState } from "react";
// import axios from "axios";
import { Button, Table } from "flowbite-react";
import ConfirmationModal from "../common/ConfirmationModal";
import api from "../../api/renderApi.js";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  // For Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7);

  // For confirmation Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actioinType, setActionType] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/admin/users", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include this to send cookies
      });
      console.log(response.data, "users data");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]); // Ensure it's an array even in case of error
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlock = async (id) => {
    try {
      await api.post(
        `/api/admin/block-user/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleUnblock = async (id) => {
    try {
      await api.post(
        `/api/admin/unblock-user/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  const openModal = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
    setIsModalOpen(true);
  };

  const confirmAction = () => {
    if (actioinType === "block") {
      handleBlock(selectedUser._id);
    } else if (actioinType === "unblock") {
      handleUnblock(selectedUser._id);
    }
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setActionType("");
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold my-4">Admin Users List</h2>
      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200" hoverable>
          <Table.Head>
            <Table.HeadCell>Sl.no</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Verified</Table.HeadCell>
            <Table.HeadCell>Blocked</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <Table.Row
                  key={user._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.isVerified ? "Yes" : "No"}</Table.Cell>
                  <Table.Cell>{user.is_blocked ? "Yes" : "No"}</Table.Cell>

                  <Table.Cell>
                    <button
                      className={` ${
                        user.is_blocked ? "bg-green-500" : "bg-red-500"
                      } text-white w-20 px-2 py-1 rounded ml-2`}
                      // onClick={() =>
                      //   user.is_blocked
                      //     ? handleUnblock(user._id)
                      //     : handleBlock(user._id)
                      // }
                      onClick={() => {
                        openModal(user, user.is_blocked ? "unblock" : "block");
                      }}
                    >
                      {user.is_blocked ? "Unblock" : "Block"}
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={6} className="text-center">
                  No users found.
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
                currentPage === number ? "bg-blue-800 text-white" : ""
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
        title={`Confirm ${actioinType === "block" ? "Block" : "Unblock"} User`}
        message={`Are you sure ? you want to ${
          actioinType === "block" ? "block" : "unblock"
        } ${selectedUser?.name} ? `}
      />
    </div>
  );
}
