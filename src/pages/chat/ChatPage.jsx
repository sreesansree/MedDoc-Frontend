import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { userChats } from "../../api/chatRequest.js";
import Conversation from "../../component/chat/Conversation.jsx";
import ChatBox from "../../component/chat/ChatBox.jsx";

import { io } from "socket.io-client";

const ChatPage = ({ userType }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentDoctor } = useSelector((state) => state.doctor);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const userID = userType === "user" ? currentUser._id : currentDoctor._id;
  const user = userType === "user" ? currentUser : currentDoctor;
  const socket = useRef();
  // console.log("User Type ID : ", userID);
  // console.log("Current Doctor : chat ", currentDoctor);
  // console.log("Current User : chat", currentUser);

  useEffect(() => {
    socket.current = io("http://localhost:5000");
    socket.current.emit("new-user-add", userID);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
      console.log("Online users : ",onlineUsers)
    });
  }, [user]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(userID);
        setChats(data);
        console.log("getChats : ", data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [currentUser]);

  return (
    <div className="relative grid grid-cols-[22%,auto] gap-4 sm:grid-cols-[16%,auto] m-2">
      {/* Left Side */}
      <div className="flex flex-col gap-4 bg-slate-50 dark:bg-gray-800">
        {/* <LogoSearch /> */}
        <div className="flex flex-col gap-4 bg-[var(--cardColor)]  dark:text-gray-500 p-4 h-auto min-h-[80vh] ">
          {" "}
          {/* overflow-scroll */}
          <h2>Chats</h2>
          <div className="flex flex-col gap-4">
            {chats.map((chat) => (
              <div
                className="bg-slate-300 p-3 text-gray-500"
                onClick={() => setCurrentChat(chat)}
              >
                <Conversation data={chat} currentUserId={currentUser._id} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col gap-4">
        <h1>right side</h1>
        <div className="w-80 self-end">
          {/* <NavIcons /> */}
          <h3>Nav Icons</h3>
        </div>

        <ChatBox chat={currentChat} currentUser={userID} />
      </div>
    </div>
  );
};

export default ChatPage;
