import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, TextInput, Label, Card } from "flowbite-react";
import { FaPlusCircle, FaPencilAlt, FaTrash } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDepartment() {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [deleteDepartmentId, setDeleteDepartmentId] = useState(null);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/api/admin/departments", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments: ", error);
      toast.error("Error fetching departments");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!currentDepartment.name) newErrors.name = "Department Name is required";
    if (!currentDepartment.description)
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEdit = async () => {
    if (!validateForm()) return;

    if (editMode) {
      // Update department
      try {
        const response = await axios.put(
          `/api/admin/departments/${currentDepartment._id}`,
          currentDepartment,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setDepartments((prev) =>
          prev.map((dept) =>
            dept._id === response.data._id ? response.data : dept
          )
        );
        toast.success("Department updated successfully");
      } catch (error) {
        toast.error("Error updating department");
        console.error("Error updating department", error);
      }
    } else {
      // Add new department
      try {
        const response = await axios.post(
          "/api/admin/departments/",
          currentDepartment,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setDepartments((prev) => [...prev, response.data]);
        toast.success("Department added successfully");
      } catch (error) {
        toast.error("Error adding department");
        console.error("Error adding department", error.message);
      }
    }
    setShowModal(false);
    setCurrentDepartment({ name: "", description: "" });
    setEditMode(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/admin/departments/${deleteDepartmentId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setDepartments((prev) =>
        prev.filter((dept) => dept._id !== deleteDepartmentId)
      );
      toast.success("Department deleted successfully");
    } catch (error) {
      toast.error("Error deleting department");
      console.error("Error deleting department", error);
    }
    setShowDeleteModal(false);
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Admin Departments</h2>
      <Button
        className="mb-4"
        onClick={() => {
          setShowModal(true);
          setEditMode(false);
        }}
      >
        <FaPlusCircle className="h-5 w-5 mr-2" /> Add Department
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((department) => (
          <Card key={department._id}>
            <h5 className="text-xl font-bold">{department.name}</h5>
            <p>{department.description}</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                size="xs"
                onClick={() => {
                  setCurrentDepartment(department);
                  setEditMode(true);
                  setShowModal(true);
                }}
              >
                <FaPencilAlt className="h-6 w-5" />
              </Button>
              <Button
                size="xs"
                color="failure"
                onClick={() => {
                  setDeleteDepartmentId(department._id);
                  setShowDeleteModal(true);
                }}
              >
                <FaTrash className="h-6 w-5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          {editMode ? "Edit Department" : "Add Department"}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" value="Department Name" />
              <TextInput
                id="name"
                type="text"
                value={currentDepartment.name}
                onChange={(e) =>
                  setCurrentDepartment({
                    ...currentDepartment,
                    name: e.target.value,
                  })
                }
                required
                color={errors.name ? "failure" : ""}
                helperText={errors.name && errors.name}
              />
            </div>
            <div>
              <Label htmlFor="description" value="Department Description" />
              <TextInput
                id="description"
                type="text"
                value={currentDepartment.description}
                onChange={(e) =>
                  setCurrentDepartment({
                    ...currentDepartment,
                    description: e.target.value,
                  })
                }
                required
                color={errors.description ? "failure" : ""}
                helperText={errors.description && errors.description}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddEdit}>{editMode ? "Update" : "Add"}</Button>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        size="md"
        onClose={() => setShowDeleteModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this department?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
