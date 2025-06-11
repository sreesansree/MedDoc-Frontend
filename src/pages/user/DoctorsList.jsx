import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Card, Button, TextInput, Checkbox, Badge, Select, Label } from "flowbite-react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(9);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/users/doctors");
        const approvedDoctors = response.data.filter(
          (doctor) => doctor.isApproved
        );
        setDoctors(approvedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Error fetching doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("/api/admin/departments/");
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

    if (selectedDepartments.length > 0) {
      filtered = filtered.filter((doctor) =>
        selectedDepartments.includes(doctor.department?._id)
      );
    }

    if (selectedExperience) {
      filtered = filtered.filter(
        (doctor) => doctor.experience >= parseInt(selectedExperience, 10)
      );
    }

    setFilteredDoctors(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, doctors, selectedDepartments, selectedExperience]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDepartmentChange = (deptId) => {
    setSelectedDepartments(prev =>
      prev.includes(deptId)
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  const handleExperienceChange = (e) => {
    setSelectedExperience(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartments([]);
    setSelectedExperience("");
  };

  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen  bg-gray-50 dark:bg-slate-800 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center dark:text-gray-400 text-gray-800 mb-8">Find Your Doctor</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - Filters (25%) */}
          <div className="w-full md:w-1/4">
            <Card className="sticky top-4">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Search & Filter</h2>
                  <div className="relative">
                    <TextInput
                      placeholder="Search doctors..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pr-10"
                    />
                    <AiOutlineSearch className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Departments</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {departments.map((dept) => (
                      <div key={dept._id} className="flex items-center">
                        <Checkbox
                          id={`dept-${dept._id}`}
                          checked={selectedDepartments.includes(dept._id)}
                          onChange={() => handleDepartmentChange(dept._id)}
                          className="mr-2"
                        />
                        <Label htmlFor={`dept-${dept._id}`}>{dept.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Experience</h3>
                  <Select
                    value={selectedExperience}
                    onChange={handleExperienceChange}
                  >
                    <option value="">All experience levels</option>
                    <option value="1">1+ years</option>
                    <option value="3">3+ years</option>
                    <option value="5">5+ years</option>
                    <option value="10">10+ years</option>
                  </Select>
                </div>

                <Button
                  color="light"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content - Doctors List (75%) */}
          <div className="w-full md:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Showing {filteredDoctors.length} doctors
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      color="light"
                      disabled={currentPage === 1}
                      onClick={() => paginate(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      color="light"
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() => paginate(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>

                {currentDoctors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentDoctors.map((doctor) => (
                      <Card key={doctor._id} className="hover:shadow-xl transition-shadow">
                        <div className="flex flex-col h-full">
                          <div className="flex justify-center mb-4">
                            <img
                              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
                              src={doctor.profilePicture || "/default-avatar.png"}
                              alt={doctor.name}
                            />
                          </div>
                          <div className="text-center flex-grow">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{doctor.name}</h3>
                            <p className="text-blue-600 font-medium">{doctor?.department?.name}</p>
                            <div className="flex justify-center space-x-2 my-2">
                              <Badge color="info">
                                {doctor.experience || 1}+ years exp
                              </Badge>
                              <Badge color="success">
                                {doctor.averageRating ? Math.ceil(doctor.averageRating) : 3}★
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                              {doctor.bio || "Specialized in patient care with extensive experience."}
                            </p>
                          </div>
                          <Link 
                            to={`/user/doctor-detail/${doctor._id}`} 
                            className="mt-4"
                          >
                            <Button
                              gradientDuoTone="purpleToBlue"
                              className="w-full"
                            >
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-700">No doctors found</h3>
                    <p className="text-gray-500 mt-2">
                      Try adjusting your search or filters
                    </p>
                    <Button
                      color="light"
                      onClick={clearFilters}
                      className="mt-4 mx-auto"
                    >
                      Clear Filters
                    </Button>
                  </Card>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="inline-flex rounded-md shadow">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        &laquo;
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={`px-3 py-1 border-t border-b border-gray-300 ${currentPage === pageNum ? 'bg-blue-50 text-blue-600 font-medium' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        &raquo;
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default DoctorsList;