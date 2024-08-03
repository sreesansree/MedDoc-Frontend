import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button } from "flowbite-react";
import { useSelector } from "react-redux";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  // console.log(doctors, "doctorsss");
  // console.log(currentUser, "currentUser");
  console.log(doctors,'docs')
  console.log(doctors.department)
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/api/users/doctors-list");
        const approvedDoctors = response.data.filter(
          (doctor) => doctor.isApproved
        );
        console.log("Approved Doctors :", approvedDoctors);
        setDoctors(approvedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  // useEffect(() => {
  //   fetchDoctors();
  // }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold my-4 text-center">Our Doctors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <Card key={doctor._id} className="shadow-lg">
              <div className="flex flex-col items-center">
                <img
                  className="w-24 h-24 rounded-full"
                  src={doctor.profilePicture || "/default-avatar.png"}
                  alt={doctor.name}
                />
                <h3 className="text-xl font-semibold mt-2">{doctor?.name}</h3>
                {/* <p className="text-gray-600">{doctor.specialization}</p> */}
                <p className="text-gray-500">{doctor?.department?.name}</p>
                <p className="text-gray-500">Experience: {doctor.experience} years</p>
                <p className="text-gray-500">Rating: 4{doctor.starRating} / 5</p>
                <Button
                  gradientDuoTone="purpleToBlue"
                  className="mt-4"
                  onClick={() => console.log("Book Consultation clicked")}
                >
                  Book Appointment
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full">No doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
