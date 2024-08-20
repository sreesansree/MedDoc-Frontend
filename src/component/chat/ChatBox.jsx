import React, { useEffect, useRef, useState } from "react";
import InputEmoji from "react-input-emoji";
import { format } from "timeago.js";
import axios from "axios";

const ChatBox = ({
  userType,
  chat,
  currentUser,
  setSendMessage,
  receiveMessage,
}) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();
console.log('Chat : ',chat)
  useEffect(() => {
    if (receiveMessage !== null && receiveMessage.chatId === chat._id) {
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage]);

  //fetching data from header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const endPoint =
          userType === "doctor"
            ? `/api/doctor/user/${userId}`
            : `/api/users/doctor/${userId}`;
        const { data } = await axios.get(endPoint);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/api/messages/${chat._id}`);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };
    // Send message to database
    try {
      const { data } = await axios.post("/api/messages", message);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }

    // send message to socket server
    const receiverId = chat?.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId });
  };

  // Always scroll to the last message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-gray-300 dark:bg-slate-800 rounded-lg grid grid-rows-[14vh_60vh_13vh]">
      {chat ? (
        <>
          <div className="p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={userData?.profilePicture}
                className="rounded-full"
                style={{ width: "50px", height: "50px" }}
                alt="Profile"
              />
              <div className="text-sm">
                <span>{userData?.name}</span>
              </div>
            </div>
            <hr className="w-[ 95%] border border-gray-200" />
          </div>

          {/* Chatbox messages */}
          <div className="flex flex-col gap-2 p-6 overflow-y-scroll">
            {messages.map((message, index) => (
              <div
                ref={scroll}
                key={index}
                className={`flex flex-col gap-1 p-3 max-w-lg w-fit rounded-lg text-white ${
                  message.senderId === currentUser
                    ? "self-end rounded-br-none bg-gradient-to-r from-teal-400 to-blue-600"
                    : "rounded-bl-none bg-yellow-500"
                }`}
              >
                <span>{message.text}</span>
                <span className="text-xs text-gray-300 self-end">
                  {format(message.createdAt)}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-gray-100 dark:bg-gray-600 flex justify-between items-center gap-4 p-3 m-2 rounded-lg">
            <div className="p-2 rounded-lg cursor-pointer">+</div>
            <InputEmoji value={newMessage} onChange={handleChange} />
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <span className="text-center text-gray-500 mt-4">
          Tap on a Chat to start a Conversation...
        </span>
      )}
    </div>
  );
};

export default ChatBox;
