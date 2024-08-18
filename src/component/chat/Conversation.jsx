import React, { useEffect, useState } from "react";
import { getUser } from "../../api/userRequest.js";

const Conversation = ({ data, currentUserId }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUserId);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
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
      <div className="follwer conversation">
        <div className="flex gap-3 mb-2">
          <div className="online-dot"></div>
          <img
            src={userData?.profilePicture}
            className="rounded-full"
            style={{ width: "50px", height: "50px" }}
          />
          <div
            className="name flex flex-col mx:5"
            style={{ fontSize: "0.8rem" }}
          >
            <span>{userData?.name}</span>
            <span>Online</span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid $ececec" }} />
    </>
  );
};

export default Conversation;
