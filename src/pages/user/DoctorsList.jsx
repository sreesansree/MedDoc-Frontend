import React, { useEffect, useState } from "react";
import { AiOutlineSearch, AiOutlineFilter } from "react-icons/ai";
// import axios from "axios";
import { Card, Button, TextInput, Select } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/renderApi.js";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(4); // Removed setter as it was not used
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [departments, setDepartments] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/api/users/doctors");
        const approvedDoctors = response.data.filter(
          (doctor) => doctor.isApproved
        );
        console.log("Approved Doctors: ", approvedDoctors);
        setDoctors(approvedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Error fetching in Doctor ");
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get("/api/admin/departments/");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    let filtered = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedDepartment) {
      filtered = filtered.filter(
        (doctor) => doctor.department?._id === selectedDepartment
      );
    }
    if (selectedExperience) {
      filtered = filtered.filter(
        (doctor) => doctor.experience === parseInt(selectedExperience, 10)
      );
    }
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors, selectedDepartment, selectedExperience]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setCurrentPage(1); // Reset to first page on filter
  };

  const handleExperienceChange = (e) => {
    setSelectedExperience(e.target.value);
    setCurrentPage(1); // Reset to first page on filter
  };

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold my-4 text-center">Our Doctors</h2>

      <div className="mb-4 flex justify-center items-center">
        <div className="relative w-1/2 mr-4">
          <TextInput
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="pr-12"
          />
          <AiOutlineSearch className="absolute right-3 top-3 text-gray-500" />
        </div>
        <div className="relative">
          <Button
            id="dropdownButton"
            gradientDuoTone="purpleToBlue"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <AiOutlineFilter className="mr-2" />
            Filter
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </Button>

          {/* Dropdown menu */}
          {showFilters && (
            <div
              id="dropdownMenu"
              className="z-10 absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-56"
            >
              <ul
                className="py-2 text-sm text-gray-700"
                aria-labelledby="dropdownButton"
              >
                <li>
                  <Select
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                    className="mb-2 w-full"
                    placeholder="Select department"
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </Select>
                </li>
                <li>
                  <Select
                    value={selectedExperience}
                    onChange={handleExperienceChange}
                    className="w-full"
                    placeholder="Select experience"
                  >
                    <option value="">All Experiences</option>
                    {[1, 2, 3, 4, 5].map((exp) => (
                      <option key={exp} value={exp}>
                        {exp} year
                        {exp > 1 ? `${exp >= 5 ? "s & above" : "s"}` : ""}
                      </option>
                    ))}
                  </Select>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentDoctors.length > 0 ? (
          currentDoctors.map((doctor) => (
            <Card key={doctor._id} className="shadow-lg ">
              <div className="flex flex-col items-center">
                <img
                  className="w-24 h-24 rounded-full"
                  src={doctor.profilePicture || "/default-avatar.png"}
                  alt={doctor.name}
                />
                <h3 className="text-xl font-semibold mt-2">{doctor.name}</h3>
                <p className="text-gray-500">{doctor?.department?.name}</p>
                <p className="text-gray-500">
                  Experience: {doctor.experience} years
                </p>
                <p className="text-gray-500">
                  Rating: 4{doctor.starRating} / 5
                </p>
                <Link to={`/user/doctor-detail/${doctor._id}`}>
                  <Button
                    gradientDuoTone="purpleToBlue"
                    className="mt-4"
                    onClick={() => console.log("Book Consultation clicked")}
                  >
                    Book Appointment
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full">No doctors found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {Array.from(
          { length: Math.ceil(filteredDoctors.length / doctorsPerPage) },
          (_, index) => (
            <Button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-1 ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {index + 1}
            </Button>
          )
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default DoctorsList;
