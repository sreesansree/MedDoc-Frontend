import React, { useEffect, useState } from "react";
import { getUser } from "../../api/userRequest";
import { getMessages } from "../../api/messageRequest";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";

const ChatBox = ({ chat, currentUser }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // fetching data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
        console.log("From ChatBox : ", data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  //Fetching data for messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
        console.log("Chat Messages : ", data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  return (
    <>
      <div className="bg-gray-300 ChatBox-container">
        {chat ? (
          <>
            <div className="chat-header">
              <div className="follower">
                <div className="flex gap-3 mb-2">
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
                  </div>
                </div>
              </div>
              <hr style={{ width: "85%", border: "0.1px solid $ececec" }} />
            </div>
            {/* Chat Box messages */}
            <div className="chat-body">
              {messages.map((message) => (
                <>
                  <div
                    className={
                      message.senderId === currentUser
                        ? "Message own"
                        : "message"
                    }
                  >
                    <span>{message.text}</span>
                    <span>{format(message.createdAt)}</span>
                  </div>
                  {/* chat-send */}
                  <div className="chat-sender">
                    <div>+</div>{" "}
                    {/* for sending images,videos,emojies use this */}
                    <InputEmoji value={newMessage} onChange={handleChange} />
                    <div className="send-button button">Send</div>
                  </div>
                </>
              ))}
            </div>
          </>
        ) : (
          <span className="chatbox-empty-messages">Tap on a Chat to start Conversation...</span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
