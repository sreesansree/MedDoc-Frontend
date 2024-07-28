import React, { useEffect, useState } from "react";
import { Button, TextInput, Label, FileInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
// import { signOutSuccessD } from "../../redux/doctor/doctorSlice.js";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function DocProfile() {
  const dispatch = useDispatch();
  const { currentDoctor } = useSelector((state) => state.doctor);
  const [doctorDetails, setDoctorDetails] = useState(currentDoctor || {});

  useEffect(() => {
    if (!currentDoctor) {
      // Fetch doctor details if not already in state
      const fetchDoctorDetails = async () => {
        const res = await fetch(`/api/doctor/profile`);
        const data = await res.json();
        if (res.ok) {
          setDoctorDetails(data);
        } else {
          console.log(data.message);
        }
      };
      fetchDoctorDetails();
    }
  }, [currentDoctor]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setDoctorDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/doctor/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctorDetails),
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(data.message);
    } else {
      console.log("Profile updated successfully");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Dr. {currentDoctor?.name}</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
            <img
              src={doctorDetails.profilePicture}
              alt="user"
              className="rounded-full w-full h-full border-8 border-[lightgray]"
            />
          </div>
          <div className="flex justify-between">
            <TextInput
              type="text"
              id="name"
              placeholder="Username"
              value={doctorDetails.name || ""}
              onChange={handleInputChange}
              className="w-full mr-2"
            />
            <TextInput
              type="email"
              id="email"
              placeholder="Email"
              value={doctorDetails.email || ""}
              onChange={handleInputChange}
              disabled
              className="w-full ml-2"
            />
          </div>
          <div className="flex justify-between">
            <TextInput
              type="text"
              id="qualification"
              placeholder="Qualification"
              value={doctorDetails.qualification || ""}
              onChange={handleInputChange}
              className="w-full mr-2"
            />
            <FileInput
              id="certificate"
              onChange={handleInputChange}
              sizing="sm"
              className="w-full ml-2"
            />
          </div>
          <div className="flex justify-between">
            <TextInput
              type="number"
              id="mobile"
              placeholder="Mobile number"
              value={doctorDetails.mobile || ""}
              onChange={handleInputChange}
              className="w-full mr-2"
            />
            <TextInput
              type="text"
              id="state"
              placeholder="State"
              value={doctorDetails.state || ""}
              onChange={handleInputChange}
              className="w-full ml-2"
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="w-full flex items-center">
              <Label htmlFor="isVerified" className="mr-2">Verified:</Label>
              <div className="relative w-full flex items-center">
                {doctorDetails.isVerified ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaTimesCircle className="text-red-500" />
                )}
              </div>
            </div>
            <div className="w-full flex items-center">
              <Label htmlFor="isApproved" className="mr-2">Approved:</Label>
              <div className="relative w-full flex items-center">
                {doctorDetails.isApproved ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaTimesCircle className="text-red-500" />
                )}
              </div>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            gradientDuoTone="purpleToPink"
            outline
          >
            Update
          </Button>
        </div>
      </form>
      
    </div>
  );
}
