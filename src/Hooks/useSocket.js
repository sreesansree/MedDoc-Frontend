// Hooks/useSocket.js
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../redux/notification/notificationSlice";

const useSocket = (userID, userType) => {
  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  // const [notification, setNotification] = useState([]);
  // const { currentChat } = useSelector((state) => state.chat);
  // const { notifications } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  // Get current chat and chat open state from Redux
  const { currentChat, isChatOpen } = useSelector((state) => state.chat);
  useEffect(() => {
    socket.current = io("http://localhost:5000");

    if (userID) {
      socket.current.emit("new-user-add", userID);
    }
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
  }, [sendMessage, onlineUsers]);

  // Receiving messages and handling notifications
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      setReceiveMessage(data);
    });

    socket.current.on("getNotification", (res) => {
      // Check if the chat is open with the sender
      const isCurrentChatOpenWithSender = currentChat?.members?.some(
        (id) => id === res.senderId
      );
      if (!isChatOpen || !isCurrentChatOpenWithSender) {
        // Only dispatch notification if chat is NOT open
        dispatch(addNotification(res));
      }
    });

    // Listen for stored notifications (offline messages)
    socket.current.on("store-notification", (notification) => {
      dispatch(addNotification(notification));
    });
    // Listen for stored notifications (when user reconnects)
    socket.current.on("getStoredNotifications", (storedNotifications) => {
      storedNotifications.forEach((notification) => {
        dispatch(addNotification(notification)); // Add each stored notification
      });
    });

    return () => {
      socket.current.off("receive-message");
      socket.current.off("store-notification");
      socket.current.off("getNotification");
      socket.current.off("getStoredNotifications");
      socket.current.off("get-users");
    };
  }, [dispatch, userID]);

  return {
    onlineUsers,
    setSendMessage,
    receiveMessage,
  };
};

export default useSocket;
