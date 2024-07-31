import React, { useEffect, useRef, useState } from "react";
import { Button, TextInput, Label, FileInput, Alert } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
// import { signOutSuccessD } from "../../redux/doctor/doctorSlice.js";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { app } from "../../firebase/firebase.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateStartD,
  updateSuccessD,
  updateFailureD,
} from "../../redux/doctor/doctorSlice.js";
import { Link } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function DocProfile() {
  const dispatch = useDispatch();
  const filePickRef = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  console.log(imageFileUploadProgress, imageFileUploadError);
  const { currentDoctor, error, loading } = useSelector(
    (state) => state.doctor
  );
  const [doctorDetails, setDoctorDetails] = useState(currentDoctor || {});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches("image/ *")
    //     }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURl) => {
          setImageFileUrl(downloadURl);
          setDoctorDetails({ ...doctorDetails, profilePicture: downloadURl });
          setImageFileUrl(null);
          setImageFileUploading(false);
        });
      }
    );
  };

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
    const res = await fetch(`/api/doctor/profile/${currentDoctor._id}`, {
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
      <h1 className="my-7 text-center font-semibold text-3xl">
        Dr. {currentDoctor?.name}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* <div > */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || doctorDetails.profilePicture}
            alt="doctor"
            className={`rounded-full w-full h-full object-cover border-8
              border-[lightgray] ${
                imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                "opacity-60"
              }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError}</Alert>
        )}
        <div className="flex justify-between">
          <TextInput
            type="text"
            id="name"
            placeholder="Username"
            defaultValue={doctorDetails.name || ""}
            onChange={handleInputChange}
            className="w-full mr-2"
          />
          <TextInput
            type="email"
            id="email"
            placeholder="Email"
            defaultValue={doctorDetails.email || ""}
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
            defaultValue={doctorDetails.qualification || ""}
            onChange={handleInputChange}
            className="w-full mr-2"
          />

          <TextInput
            type="number"
            id="mobile"
            placeholder="Mobile number"
            defaultValue={doctorDetails.mobile || ""}
            onChange={handleInputChange}
            className="w-full ml-2"
          />
        </div>
        <div className="flex justify-between mt-2">
          <TextInput
            type="text"
            id="department"
            placeholder="department"
            defaultValue={doctorDetails.department || ""}
            onChange={handleInputChange}
            className="w-full mr-2"
          />
          <TextInput
            type="text"
            id="state"
            placeholder="State"
            defaultValue={doctorDetails.state || ""}
            onChange={handleInputChange}
            className="w-full ml-2"
          />
        </div>
        <div>
          <Label value="Certificate" className="m-3 mb-2" />
          <FileInput
            type="file"
            accept="image/*"
            id="certificate"
            onChange={handleImageChange}
            sizing="sm"
            className="w-full ml-2"
          />{" "}
          {/* <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
            <img
              src={doctorDetails?.certificate}
              alt="user"
              className="rounded-full w-full h-full border-8 border-[lightgray]"
            />
          </div> */}
        </div>
        <div className="flex justify-between items-center">
          <div className="w-full flex items-center">
            <Label htmlFor="isVerified" className="mr-2">
              Verified:
            </Label>
            <div className="relative w-full flex items-center">
              {doctorDetails.isVerified ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaTimesCircle className="text-red-500" />
              )}
            </div>
          </div>
          <div className="w-full flex items-center">
            <Label htmlFor="isApproved" className="mr-2">
              Approved:
            </Label>
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
        {/* </div> */}
      </form>
    </div>
  );
}
