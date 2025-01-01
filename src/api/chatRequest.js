// import axios from "axios";
import api from "./renderApi.js";
//   from chatRequest.js
// const API = axios.create({ baseURL: "http://localhost:5000" });

// export const userChats = (id) => API.get(`/api/chat/${id}`);

export const userChats = async (id) => {
  try {
    const res = await api.get(`/api/chat/${id}`);
    return res.data.chats;
  } catch (error) {
    console.error("Error getting chat :", error);
  }
};

export const createChat = async (chatData) => {
  try {
    const response = await api.post("/api/chat/", chatData);
    return response.data;
  } catch (error) {
    console.error("Error creating chat :", error);
  }
};
