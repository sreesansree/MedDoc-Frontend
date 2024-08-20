import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { userChats, createChat } from "../../api/chatRequest.js";
import Conversation from "../../component/chat/Conversation.jsx";
import ChatBox from "../../component/chat/ChatBox.jsx";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const ChatPage = ({ userType }) => {
  const { receiverId, appointmentId } = useParams();
  // console.log("receiverId", receiverId);
  // console.log("AppointmentId", appointmentId);
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

  // Sending message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Connect to socket
  useEffect(() => {
    socket.current = io("http://localhost:5000");
    socket.current.emit("new-user-add", userID);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.current.disconnect();
    };
  }, [userID]);

  // Receive message from Socket server
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      setReceiveMessage(data);
    });
  }, []);
  const startNewChat = async (receiverId, appointmentId) => {
    console.log("receiverId from startNewChat : ", receiverId);
    console.log("appointmentId from startNewChat : ", appointmentId);
    try {
      const newChatData = {
        senderId: userID,
        receiverId: receiverId,
        appointmentId: appointmentId,
      };
      const createdChat = await createChat(newChatData);
      setChats((prevChats) => [...prevChats, createdChat]);
      setCurrentChat(createdChat);
    } catch (error) {
      console.error("Error starting new chat:", error);
    }
  };

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(userID);
        setChats(data);
        console.log("getChats: ", data);

        const someConditionToStartChat = !data.some(
          (chat) => chat.appointmentId === appointmentId
        );

        if (data.length === 0 && someConditionToStartChat) {
          await startNewChat(receiverId, appointmentId);
        }
      } catch (error) {
        console.log("Error fetching chats:", error);
      }
    };
    getChats();
  }, [userID, receiverId, appointmentId]);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat?.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    console.log("Online:", online);
    return online ? true : false;
  };

  return (
    <div className="relative grid grid-cols-[22%,auto] gap-4 sm:grid-cols-[16%,auto] m-2">
      {/* Left Side */}
      <div className="flex flex-col gap-4 bg-slate-300 dark:bg-gray-800 sm:col-span-1">
        <div className="flex flex-col gap-4 bg-[var(--cardColor)] dark:text-gray-500 p-4 h-auto min-h-[80vh]">
          <h2>Chats</h2>
          <div className="flex flex-col gap-4">
            {chats.map((chat) => (
              <div
                key={chat._id}
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
      <div className="flex flex-col gap-4 sm:col-span-1">
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
