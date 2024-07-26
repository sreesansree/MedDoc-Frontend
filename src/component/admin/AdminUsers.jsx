import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table } from "flowbite-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  console.log(users, "dpctorsssssss");

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/users", {
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
      await axios.post(
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
      await axios.post(
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

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold my-4">Admin Users List</h2>
      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200" hoverable>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Verified</Table.HeadCell>
            <Table.HeadCell>Blocked</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <Table.Row
                  key={user._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.isVerified ? "Yes" : "No"}</Table.Cell>
                  <Table.Cell>{user.is_blocked ? "Yes" : "No"}</Table.Cell>

                  {/* <Table.Cell>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                      onClick={() => handleBlock(user._id)}
                    >
                      Block
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
                      onClick={() => handleUnblock(user._id)}
                    >
                      Unblock
                    </button>
                  </Table.Cell> */}
                  <Table.Cell>
                    <button
                      className={` ${
                        user.is_blocked ? "bg-green-500" : "bg-red-500"
                      } text-white w-20 px-2 py-1 rounded ml-2`}
                      onClick={() =>
                        user.is_blocked
                          ? handleUnblock(user._id)
                          : handleBlock(user._id)
                      }
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
      </div>
    </div>
  );
}
