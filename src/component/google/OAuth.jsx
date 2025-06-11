import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase/firebase";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { signInSuccess } from "../../redux/user/userSlice";
import { signInSuccessD } from "../../redux/doctor/doctorSlice";
import PropTypes from "prop-types";

export default function OAuth({ userType }) {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const endPoint =
        userType === "doctor" ? "/api/doctor/google" : "/api/users/google";
      const res = await fetch(endPoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (userType === "user") {
          dispatch(signInSuccess(data));
          // navigate("/");
          const from = location.state?.from || "/";
          navigate(from);
        } else {
          dispatch(signInSuccessD(data));
          // navigate("/doctor");
          const from = location.state?.from || "/";
          navigate(from);
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

// Add PropTypes validation
OAuth.propTypes = {
  userType: PropTypes.oneOf(["user", "doctor"]).isRequired,
};
