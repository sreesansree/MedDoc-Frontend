import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import axios from "axios";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import OAuth from "../../component/google/OAuth.jsx";

export default function DocRegister() {
  const [formData, setFromData] = useState({});
  const certificatePickRef = useRef();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [certificateFileUrl, setCertificateFileUrl] = useState(null);
  const [certificateFileUploadError, setCertificateFileUploadError] = useState(null);
  const [certificateFileUploading, setCertificateFileUploading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setCertificate(e.target.files[0]);
    } else {
      setFromData({ ...formData, [e.target.id]: e.target.value.trim() });
    }
  };

  const uploadCertificate = async () => {
    if (!certificate) return;
    setCertificateFileUploading(true);
    setCertificateFileUploadError(null);
    
    const storage = getStorage(); // Use default app instance if needed
    const fileName = new Date().getTime() + certificate.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, certificate);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          setCertificateFileUploadError("Could not upload certificate (File must be less than 2MB)");
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setCertificateFileUrl(downloadURL);
            setCertificateFileUploading(false);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !certificate) {
      setErrorMessage("Please fill out all fields and upload your certificate.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const certificateUrl = await uploadCertificate();

      const res = await axios.post("/api/doctor/register", { ...formData, certificate: certificateUrl }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status !== 200 && res.status !== 201) {
        setErrorMessage(res.data.message || "Something went wrong. Please try again.");
      } else {
        navigate("/doctor/verify-otp");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 font-bold">
              MedDoc
            </span>
          </Link>
          <p className="text-sm mt-5">
            Register as a doctor to provide consultations and manage appointments. Sign up with your email and password.
          </p>
        </div>

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <h1 className="text-lg font-bold text-center">Doctor Register</h1>
            <div>
              <Label value="Name" />
              <TextInput type="text" placeholder="Enter your name" id="name" onChange={handleChange} />
            </div>
            <div>
              <Label value="Email" />
              <TextInput type="email" placeholder="Enter your email address" id="email" onChange={handleChange} />
            </div>
            <div>
              <Label value="Password" />
              <TextInput type="password" placeholder="Password" id="password" onChange={handleChange} />
            </div>
            <div>
              <Label value="Certificate" />
              <input
                type="file"
                id="certificate"
                accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone={"purpleToPink"} type="submit" outline disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth userType="doctor" />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to={"/doctor/login"} className="text-blue-500">
              Sign In
            </Link>
          </div>
          {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
        </div>
      </div>
    </div>
  );
}
