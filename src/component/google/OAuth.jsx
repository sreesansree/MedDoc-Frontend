import React from "react";
import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase/firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../../redux/user/userSlice";
import { signInSuccessD } from "../../redux/doctor/doctorSlice";

export default function OAuth({ userType }) {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      // console.log(resultsFromGoogle);
      const endPoint =
        userType === "doctor" ? "/api/doctor/google" : "/api/users/google";
      const res = await fetch(
        `https://meddoc-backend-cqw0.onrender.com${endPoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: resultsFromGoogle.user.displayName,
            email: resultsFromGoogle.user.email,
            googlePhotoUrl: resultsFromGoogle.user.photoURL,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        if (userType === "user") {
          dispatch(signInSuccess(data));
          navigate("/");
        } else {
          dispatch(signInSuccessD(data));
          navigate("/doctor");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      className="flex justify-center items-center"
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue With Google
    </Button>
  );
}
