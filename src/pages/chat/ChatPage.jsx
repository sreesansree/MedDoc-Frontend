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
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);

  const userID = userType === "user" ? currentUser._id : currentDoctor._id;
  const user = userType === "user" ? currentUser : currentDoctor;
  const socket = useRef();
  // console.log("user Type in chat page :", userType);
  // console.log("User Type ID : ", userID);
  // console.log("Current Doctor : chat ", currentDoctor);
  // console.log("Current User : chat", currentUser);

  // sending message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    socket.current = io("http://localhost:5000");
    // socket.current = io("http://localhost:5173");
    socket.current.emit("new-user-add", userID);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  // receive message from Socket server
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      setReceiveMessage(data);
    });
  }, []);

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
  }, [user]);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat?.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  return (
    <div className="relative grid grid-cols-[22%,auto] gap-4 sm:grid-cols-[16%,auto] m-2">
      {/* Left Side */}
      <div className="flex flex-col gap-4 bg-slate-300 dark:bg-gray-800">
        {/* <LogoSearch /> */}
        <div className="flex flex-col gap-4 bg-[var(--cardColor)  dark:text-gray-500 p-4 h-auto  min-h-[80vh] ">
          {" "}
          {/* overflow-scroll */}
          <h2>Chats</h2>
          <div className="flex flex-col gap-4" >
            {chats.map((chat) => (
              <div
                className="dark:bg-slate-600 bg-slate-200 rounded p-3 dark:text-gray-300 flex flex-col"
                onClick={() => setCurrentChat(chat)}
              >
                <Conversation
                  userType={userType}
                  data={chat}
                  currentUserId={user._id}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col gap-4">
        {/* <h1>right side</h1>
        <div className="w-80 self-end">
        
          <h3>Nav Icons</h3>
        </div> */}

        <ChatBox
          userType={userType}
          chat={currentChat}
          currentUser={userID}
          setSendMessage={setSendMessage}
          receiveMessage={receiveMessage}

        />
      </div>
    </div>
  );
};

export default ChatPage;
