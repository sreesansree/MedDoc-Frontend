import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
// import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addNotification } from "../redux/notification/notificationSlice";

const useSocket = (userID, userType) => {
  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);

  const dispatch = useDispatch();

  // Connect to socket
  useEffect(() => {
    socket.current = io("http://localhost:5000");
    socket.current.emit("new-user-add", userID);
    // console.log("Socket connected:", socket.current);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [userID]);

  // Sending message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      const isReceiverOnline = onlineUsers.some(
        (user) => user.userId === sendMessage.receiverId
      );
      if (isReceiverOnline) {
        socket.current.emit("send-message", sendMessage);
      } else {
        socket.current.emit("store-notification", sendMessage); // Store notification for offline receiver
      }
    }
  }, [sendMessage]);

  // Receiving messages and handling notifications
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      if (data.senderId !== userID) {
        dispatch(
          addNotification({
            message: `New message from ${data.senderName}`,
            chatId: data.chatId,
            date: new Date(),
          })
        );
        // toast(`New message from ${data.senderName}`);
        setReceiveMessage(data);
      }
    });

    // // Listen for stored notifications (offline messages)

    socket.current.on("store-notification", (notification) => {
      dispatch(addNotification(notification));
    });

    return () => {
      socket.current.off("receive-message");
      socket.current.off("store-notification");
    };
  }, [dispatch, userID]);

  return {
    onlineUsers,
    setSendMessage,
    receiveMessage,
  };
};

export default useSocket;
