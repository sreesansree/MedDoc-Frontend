import React, { useEffect, useState } from "react";
// import { getUser } from "../../api/userRequest.js";
import axios from "axios";

const Conversation = ({ userType, data, currentUserId, online }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUserId);
    const getUserData = async () => {
      try {
        const endPoint =
          userType === "doctor"
            ? `/api/doctor/${userId}`
            : `/api/users/${userId}`;
        const { data } = await axios.get(endPoint);
        setUserData(data);
        console.log("From Conversation , Get User : ", data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, []);

  return (
    <>
      <div className="">
        <div className="flex gap-3 mb-2 ">
          {online && (
            <div className="absolute left-8 w-4 h-4 bg-green-400 rounded-full"></div>
          )}
          <img
            src={userData?.profilePicture}
            className="rounded-full"
            style={{ width: "50px", height: "50px" }}
          />
          <div
            className="flex flex-col mx:5 invisible lg:visible"
            style={{ fontSize: "0.8rem" }}
          >
            <span>{userData?.name}</span>

            <span>{online ? "Online" : "Offline "}</span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid $ececec" }} />
    </>
  );
};

export default Conversation;
