import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userChats, createChat } from "../../api/chatRequest.js";
import Conversation from "../../component/chat/Conversation.jsx";
import ChatBox from "../../component/chat/ChatBox.jsx";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useSocket from "../../Hooks/useSocket.js";
// import { openChat, closeChat } from "../../redux/chat/chatSlice.js";

const ChatPage = ({ userType }) => {
  const dispatch = useDispatch();

  const { receiverId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const { currentDoctor } = useSelector((state) => state.doctor);

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const userID = userType === "user" ? currentUser._id : currentDoctor._id;
  const user = userType === "user" ? currentUser : currentDoctor;
  // Use the custom socket hook
  const { onlineUsers, setSendMessage, receiveMessage } = useSocket(
    userID,
    user
  );

  // useEffect(() => {
  //   dispatch(openChat());
  //   return () => {
  //     dispatch(closeChat());
  //   };
  // }, [dispatch]);

  const startNewChat = async (receiverId) => {
    try {
      const newChatData = {
        senderId: userID,
        receiverId: receiverId,
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
        const chatData = await userChats(userID); // The response should now be an array
        setChats(chatData || []); // Directly set the chat array

        // If there are no chats, start a new one
        if (chatData.length === 0) {
          await startNewChat(receiverId);
        }
      } catch (error) {
        toast.error(error?.message || "Error in fetching chats");
        console.log("Error fetching chats:", error);
      }
    };
    getChats();
  }, [userID, receiverId]);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat?.members?.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
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
                onClick={() => {
                  setCurrentChat(chat);
                  dispatch(setCurrentChat(chat));
                }}
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
          currentUserName={user.name}
          setSendMessage={setSendMessage}
          receiveMessage={receiveMessage}
        />
      </div>
    </div>
  );
};

export default ChatPage;
