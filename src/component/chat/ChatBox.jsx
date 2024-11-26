import React, { useEffect, useRef, useState, useMemo } from "react";
import InputEmoji from "react-input-emoji";
import { format } from "timeago.js";
import axios from "axios";
import { Modal, Button } from "flowbite-react";
import { FaPlus, FaReply } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { uploadFileToFirebase } from "../../firebase/firebase";

const ChatBox = ({
  userType,
  chat,
  currentUser,
  currentUserName,
  setSendMessage,
  receiveMessage,
}) => {
  // console.log("currentUser", currentUser);
  // console.log("currentUserName", currentUserName);
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // For image/video preview
  const [audioPreview, setAudioPreview] = useState(null); // For audio preview

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State to control delete confirmation modal
  const [messageToDelete, setMessageToDelete] = useState(null); // State to track which message to delete
  const scroll = useRef();

  useEffect(() => {
    if (
      receiveMessage !== null &&
      chat !== null &&
      receiveMessage.chatId === chat._id
    ) {
      setMessages((prevMessages) => [...prevMessages, receiveMessage]);
    }
  }, [receiveMessage, chat]);

  const userId = useMemo(() => {
    return chat?.members?.find((id) => id !== currentUser);
  }, [chat, currentUser]);

  useEffect(() => {
    const getUserData = async () => {
      console.log(userId, "userID from chatBox");
      try {
        const endPoint =
          userType === "user"
            ? `/api/users/doctor/${userId}`
            : `/api/doctor/user/${userId}`;
        const { data } = await axios.get(endPoint);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, userId, userType]);

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
    }
  };

  // State to track reply
  const [replyTo, setReplyTo] = useState(null);

  const clearPreviews = () => {
    setFilePreview(null);
    setAudioPreview(null);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage && !file && !audioURL) return; // Prevent sending empty messages

    const message = {
      senderId: currentUser,
      senderName: currentUserName,
      text: newMessage,
      chatId: chat._id,
      replyTo: replyTo ? replyTo._id : null, // Include the reply
    };

    try {
      // let messageData;
      if (file) {
        // Upload file to Firebase and get the download URL
        const downloadURL = await uploadFileToFirebase(file);
        message.file = downloadURL;
        message.fileType = file.type;
        setFile(null);
      } else if (audioURL) {
        // Upload audio to Firebase and get the download URL
        const audioFile = new File([audioURL], "audio.wav", {
          type: "audio/wav",
        });
        const downloadURL = await uploadFileToFirebase(audioFile);
        message.file = downloadURL;
        message.fileType = "audio/wav";
        setAudioURL(null);
      }

      // Send the message to the backend
      // const { data  } = await axios.post("/api/messages", message);
      // messageData = data;
      const { data: messageData } = await axios.post("/api/messages", message);

      // Add the new message to the chat
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
      setReplyTo(null);
      clearPreviews();
      // Send the message to Socket.io server
      const receiverId = chat?.members.find((id) => id !== currentUser);
      setSendMessage({
        ...messageData,
        receiverId,
        senderName: currentUserName,
      });
    } catch (error) {
      console.log(error);
    }

    // Send message to Socket.io server
    const receiverId = chat?.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId, senderName: currentUserName });
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.start();

      const audioChunks = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setAudioURL(audioBlob);
        setIsRecording(false);
      };
      setIsRecording(true);
    });
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    if (audioURL) {
      const previewUrl = URL.createObjectURL(audioURL);
      setAudioPreview(previewUrl);
    }
  };
  // Clear previews after sending

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle delete with confirmation modal
  const confirmDeleteMessage = (message) => {
    setMessageToDelete(message); // Store message to delete
    setIsDeleteModalOpen(true); // Open confirmation modal
  };

  // Handle delete
  const handleDeleteMessage = async () => {
    try {
      await axios.delete(`/api/messages/${messageToDelete._id}`);
      setMessages(messages.filter((msg) => msg._id !== messageToDelete._id));
      setIsDeleteModalOpen(false); // Close modal after deletion
    } catch (error) {
      console.log("Error deleting message", error);
    }
  };
  const handleReply = (message) => {
    setReplyTo(message); // Set the message being replied to
    console.log("Replying to message:", message);
  };

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

          <div className="flex flex-col gap-2 p-6 overflow-y-scroll">
            {messages.map((message, index) => (
              <div
                ref={scroll}
                key={index}
                className={`flex flex-col gap-1 p-3 max-w-lg w-fit rounded-lg text-white ${
                  message.senderId === currentUser
                    ? "self-end rounded-br-none bg-gradient-to-r from-teal-400 to-blue-600"
                    : "rounded-bl-none bg-yellow-400"
                }`}
              >
                {message.replyTo && (
                  <div className="reply-preview">
                    <span className="text-sm text-gray-600 ">
                      {`${
                        message.senderId === currentUser
                          ? "Replying to"
                          : "Replayed to"
                      }`}
                      : {message.replyTo?.text || "Deleted message"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  {message.file ? (
                    message.fileType?.startsWith("image") ? (
                      <img
                        src={message.file}
                        alt="Sent"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          objectFit: "cover",
                        }}
                      />
                    ) : message.fileType?.startsWith("video") ? (
                      <video
                        controls
                        src={message.file}
                        style={{ maxWidth: "200px" }}
                      />
                    ) : message.fileType?.startsWith("audio") ? (
                      <audio controls src={message.file} />
                    ) : (
                      <span>Unsupported file type</span>
                    )
                  ) : (
                    <span>{message.text}</span>
                  )}
                  {/* Add a delete button */}
                  {message.senderId === currentUser && (
                    <button
                      onClick={() => confirmDeleteMessage(message)}
                      className="text-gray-800 text-sm"
                    >
                      <MdDelete />
                    </button>
                  )}
                </div>

                <span className="text-xs text-gray-300 self-end">
                  {format(message.createdAt)}
                </span>
                {/* Reply button */}
                <button
                  onClick={() => handleReply(message)}
                  className="text-sm text-gray-700"
                >
                  <FaReply />
                </button>

                {/* Display the reply */}
              </div>
            ))}
          </div>

          <div className="bg-gray-100 dark:bg-gray-600 flex justify-between items-center gap-4 p-3 m-2 rounded-lg">
            {filePreview && (
              <div className="preview-container flex items-center gap-2">
                {file.type.startsWith("image") && (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-w-[100px] max-h-[100px] rounded-lg"
                  />
                )}
                {file.type.startsWith("video") && (
                  <video
                    src={filePreview}
                    controls
                    className="max-w-[150px] max-h-[100px] rounded-lg"
                  />
                )}
                <button
                  onClick={() => {
                    setFile(null);
                    setFilePreview(null);
                  }}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            )}
            {audioPreview && (
              <div className="preview-container flex items-center gap-2">
                <audio src={audioPreview} controls />
                <button
                  onClick={() => {
                    setAudioURL(null);
                    setAudioPreview(null);
                  }}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="p-2 rounded-lg cursor-pointer">
              <FaPlus
                onClick={() => setIsModalOpen(true)}
                className="text-xl text-gray-500 cursor-pointer"
              />
            </div>

            {/* Modal */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <Modal.Header>Select Media</Modal.Header>
              <Modal.Body>
                <div className="flex flex-col gap-4">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    className="border p-2"
                  />
                  {isRecording ? (
                    <Button color="failure" onClick={stopRecording}>
                      Stop Recording
                    </Button>
                  ) : (
                    <Button color="success" onClick={startRecording}>
                      Record Voice
                    </Button>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => setIsModalOpen(false)}>Close</Button>
              </Modal.Footer>
            </Modal>
            {replyTo && (
              <div className="reply-preview bg-gray-200 p-2 rounded-lg mb-2">
                <span className="text-sm text-gray-700">
                  Replying to: {replyTo.text || "Deleted message"}
                </span>
                <button
                  onClick={() => setReplyTo(null)}
                  className="text-red-500 ml-2"
                >
                  Cancel
                </button>
              </div>
            )}

            <InputEmoji value={newMessage} onChange={handleChange} />
            <button
              className="bg-blue-500 w-auto text-white  py-2 px-4 rounded-lg"
              onClick={handleSend}
            >
              <IoMdSend />
            </button>
            {/* Delete confirmation modal */}
            <Modal
              show={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
            >
              <Modal.Header>Delete Message</Modal.Header>
              <Modal.Body>
                <p>Are you sure you want to delete this message?</p>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={handleDeleteMessage}>Yes, delete it</Button>
                <Button
                  color="gray"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>
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
