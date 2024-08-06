import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Modal, TextInput, Button } from "flowbite-react";
import { GiCheckMark } from "react-icons/gi";

export default function AdminDoctorApproval() {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [rejectedDoctors, setRejectedDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("/api/admin/doctors", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const notApprovedDoctors = response.data.filter(
        (doctor) => doctor.status === "pending"
      );
      const rejectedDoctors = response.data.filter(
        (doctor) => doctor.status === "rejected"
      );

      setPendingDoctors(notApprovedDoctors);
      setRejectedDoctors(rejectedDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setPendingDoctors([]);
      setRejectedDoctors([]);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleApprove = async () => {
    try {
      await axios.post(
        `/api/admin/approve-doctor/${selectedDoctor._id}`,
        {},
        {
          withCredentials: true,
        }
      );
      setIsApprovalModalOpen(false);
      fetchDoctors(); // Refresh the list
    } catch (error) {
      console.error("Error approving doctor:", error);
    }
  };

  const handleApproveClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsApprovalModalOpen(true);
  };

  const handleRejectClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsRejectionModalOpen(true);
  };

  const handleReject = async () => {
    try {
      await axios.post(
        `/api/admin/reject-doctor/${selectedDoctor._id}`,
        { rejectionReason },
        {
          withCredentials: true,
        }
      );
      setIsRejectionModalOpen(false);
      fetchDoctors(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting doctor:", error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold my-4">
        Doctor Approval Management
      </h2>

      {/* Pending Doctors */}
      <h3 className="text-xl font-semibold my-4">Pending Approval</h3>
      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200" hoverable>
          <Table.Head>
            <Table.HeadCell>Profile Picture</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Certificate</Table.HeadCell>
            <Table.HeadCell>Verified</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {Array.isArray(pendingDoctors) && pendingDoctors.length > 0 ? (
              pendingDoctors.map((doctor) => (
                <Table.Row
                  key={doctor._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    <img
                      src={doctor.profilePicture}
                      alt="Profile"
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{doctor.name}</Table.Cell>
                  <Table.Cell>{doctor.email}</Table.Cell>
                  <Table.Cell>
                    <img
                      src={doctor.certificate}
                      alt="Certificate"
                      className="w-12 h-12"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {doctor.isVerified ? (
                      <GiCheckMark className="text-teal-600" />
                    ) : (
                      "No"
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                      onClick={() => handleApproveClick(doctor)}
                    >
                      {doctor.isApproved ? "Approved" : "Approve"}
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                      onClick={() => handleRejectClick(doctor)}
                    >
                      Reject
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={6} className="text-center">
                  No pending doctors.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Rejected Doctors */}
      <h3 className="text-xl font-semibold my-4">Rejected</h3>
      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200" hoverable>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Verified</Table.HeadCell>
            <Table.HeadCell>Rejection Reason</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {Array.isArray(rejectedDoctors) && rejectedDoctors.length > 0 ? (
              rejectedDoctors.map((doctor) => (
                <Table.Row
                  key={doctor._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{doctor.name}</Table.Cell>
                  <Table.Cell>{doctor.email}</Table.Cell>
                  <Table.Cell>
                    {doctor.isVerified ? <GiCheckMark /> : "No"}
                  </Table.Cell>
                  <Table.Cell>{doctor.rejectionReason}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={4} className="text-center">
                  No rejected doctors.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Approval Modal */}
      <Modal
        show={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        size="md"
        className="w-full"
      >
        <Modal.Header>Approve Doctor</Modal.Header>
        <Modal.Body>
          {selectedDoctor && (
            <>
              <div className="mb-4">
                <img
                  src={selectedDoctor.certificate}
                  alt="Certificate"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="text-center">
                <Button
                  color="success"
                  onClick={handleApprove}
                >
                  Approve
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setIsApprovalModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        show={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        size="md"
        className="w-full"
      >
        <Modal.Header>Reject Doctor</Modal.Header>
        <Modal.Body>
          <TextInput
            id="rejectionReason"
            type="text"
            placeholder="Enter reason for rejection"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="failure"
            onClick={handleReject}
            disabled={!rejectionReason}
          >
            Reject
          </Button>
          <Button color="gray" onClick={() => setIsRejectionModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
