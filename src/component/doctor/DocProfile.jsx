import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { app } from "../../firebase/firebase.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, TextInput, Label, Alert, Select, Modal } from "flowbite-react";
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
// import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import api from "../../api/renderApi.js";

export default function DocProfile() {
  const dispatch = useDispatch();
  const filePickRef = useRef();
  const certificatePickRef = useRef();
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);

  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const [updateDoctorSuccess, setUpdateDoctorSuccess] = useState(null);
  const [updateDoctorError, setUpdateDoctorError] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [certificateFile, setCertificateFile] = useState(null);
  const [certificateFileUrl, setCertificateFileUrl] = useState(null);
  const [certificateFileUploadError, setCertificateFileUploadError] =
    useState(null);
  const [certificateFileUploading, setCertificateFileUploading] =
    useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const { currentDoctor, error, loading } = useSelector(
    (state) => state.doctor
  );

  useEffect(() => {
    if (currentDoctor) {
      setFormData({
        name: currentDoctor.name,
        email: currentDoctor.email,
        qualification: currentDoctor.qualification,
        mobile: currentDoctor.mobile,
        department: currentDoctor.department,
        state: currentDoctor.state,
        profilePicture: currentDoctor.profilePicture,
        certificate: currentDoctor.certificate,
      });
    }
  }, [currentDoctor]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleCertificateChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertificateFile(file);
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  useEffect(() => {
    if (certificateFile) {
      uploadCertificate();
    }
  }, [certificateFile]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get("/api/admin/departments/");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments: ", error);
      }
    };
    fetchDepartments();
  }, []);

  const uploadImage = async () => {
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
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUrl(null);
          setImageFileUploading(false);
        });
      }
    );
  };

  const uploadCertificate = async () => {
    setCertificateFileUploading(true);
    setCertificateFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + certificateFile.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, certificateFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        setCertificateFileUploadError(
          "Could not upload certificate (File must be less than 2MB)"
        );
        setCertificateFile(null);
        setCertificateFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setCertificateFileUrl(downloadURL);
          setFormData((prevFormData) => ({
            ...prevFormData,
            certificate: downloadURL,
          }));
          setCertificateFileUploading(false);
        });
      }
    );
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateDoctorError(null);
    setUpdateDoctorSuccess(null);
    if (Object.keys(formData).length === 0) {
      return;
    }
    if (imageFileUploading || certificateFileUploading) {
      setUpdateDoctorError("Please wait for file uploads to complete");
      return;
    }
    try {
      dispatch(updateStartD());
      const response = await api.put(
        `/api/doctor/profile/${currentDoctor._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          withCredentials: true,
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        dispatch(updateFailureD(response.data.message));
        setUpdateDoctorError(response.data.message);
        toast.error("Update Error");
        console.error("Update Error:", response.data.message); // Add this
      } else {
        dispatch(updateSuccessD(response.data));
        setUpdateDoctorSuccess(response.data.message);
        toast.success("Profile updated Successfully");
        console.log("Update Success:", response.data.message); // Add this
      }
    } catch (error) {
      dispatch(updateFailureD(error.message));
      setUpdateDoctorError(error.message);
      toast.error("Catch Error..");
      console.error("Catch Error:", error.message); // Add this
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">
        Dr. {currentDoctor?.name}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  stroke: `rgba(62,152,199 ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentDoctor?.profilePicture}
            alt="doctor"
            className={`rounded-full w-full h-full object-cover border-8
              border-[lightgray] ${imageFileUploading && "opacity-60"}`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError}</Alert>
        )}

        <div className="flex gap-6 justify-between">
          {/* <Label htmlFor="name" value="Name" /> */}
          <TextInput
            id="name"
            type="text"
            placeholder="Enter your name"
            required
            defaultValue={currentDoctor?.name || ""}
            onChange={handleInputChange}
            className="w-full"
          />
          {/* </div>
        <div> */}
          {/* <Label htmlFor="email" value="Email" /> */}
          <TextInput
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            defaultValue={currentDoctor?.email || ""}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        <div className="flex gap-6 justify-between">
          {/* <Label htmlFor="qualification" value="Qualification" /> */}
          <TextInput
            id="qualification"
            type="text"
            placeholder="Enter your qualification"
            required
            defaultValue={currentDoctor?.qualification || ""}
            onChange={handleInputChange}
            className="w-full"
          />
          {/* </div>
        <div> */}
          {/* <Label htmlFor="mobile" value="Mobile" /> */}
          <TextInput
            id="mobile"
            type="text"
            placeholder="Enter your mobile number"
            required
            defaultValue={currentDoctor?.mobile || ""}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        <div className="flex gap-6 justify-between">
          {/* <Label htmlFor="department" value="Department" /> */}
          <Select
            id="department"
            className="w-full"
            required
            value={formData.department || ""}
            onChange={(e) => {
              setFormData({ ...formData, department: e.target.value });
            }}
          >
            <option value="" disabled>
              Select department
            </option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </Select>
          <TextInput
            id="experience"
            type="text"
            placeholder="Enter your Experience"
            required
            defaultValue={currentDoctor?.experience || ""}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="state" value="State" />
          <TextInput
            id="state"
            type="text"
            placeholder="Enter your state"
            required
            defaultValue={currentDoctor?.state || ""}
            onChange={handleInputChange}
            className="w-full ml-2"
          />
        </div>
        <div className="flex items-center justify-between mt-4 ">
          <div
            className="relative w-full self-center cursor-pointer shadow-md overflow-hidden"
            onClick={() => certificatePickRef.current.click()}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={handleCertificateChange}
              ref={certificatePickRef}
              hidden
            />
            <div className="border-2 border-gray-300 p-2 rounded-lg text-center text-gray-400">
              Click to upload certificate
            </div>
          </div>

          {currentDoctor.certificate && (
            // {certificateFileUrl && (
            <Button
              color="info"
              onClick={() => setShowCertificateModal(true)}
              className="ml-4"
              size={"sm"}
            >
              View
            </Button>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div className="w-full flex items-center">
            <Label htmlFor="isVerified" className="mr-2">
              Verified:
            </Label>
            <div className="relative w-full flex items-center">
              {currentDoctor.isVerified ? (
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
              {currentDoctor.isApproved ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaTimesCircle className="text-red-500" />
              )}
            </div>
          </div>
        </div>

        <Button type="submit" className="mt-4">
          Update
        </Button>
        {certificateFileUploadError && (
          <Alert color={"failure"}>{certificateFileUploadError}</Alert>
        )}

        {updateDoctorSuccess && (
          <Alert
            color={"success"}
            className="mt-5 bg-green-100 border border-green-500"
          >
            {updateDoctorSuccess}
          </Alert>
        )}
        {updateDoctorError && (
          <Alert
            color={"failure"}
            className="mt-5 bg-red-100 border border-red-500"
          >
            {updateDoctorError}
          </Alert>
        )}
        {error && (
          <Alert
            color={"failure"}
            className="mt-5 bg-red-100 border border-red-500"
          >
            {error}
          </Alert>
        )}
      </form>
      <ToastContainer />

      {/* Modal for viewing certificate */}
      <Modal
        show={showCertificateModal}
        size="lg"
        onClose={() => setShowCertificateModal(false)}
      >
        <Modal.Header>Certificate</Modal.Header>
        <Modal.Body>
          {currentDoctor.certificate ? (
            // <img
            //   src={certificateFileUrl}
            //   alt="certificate"
            //   className="rounded-lg w-full h-full object-cover"
            <img
              src={currentDoctor.certificate}
              className="w-full h-96"
              title="Doctor Certificate"
            />
          ) : (
            <p>No certificate available to preview.</p>
          )}
        </Modal.Body>
        <Modal.Footer className="flex justify-between">
          <Button onClick={() => setShowCertificateModal(false)}>Close</Button>
          {/* Download button */}
          <a
            href={currentDoctor.certificate}
            download={`Doctor-${currentDoctor.name}-Certificate`}
            className="ml-4 text-blue-600 underline"
          >
            Download
          </a>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
