import axios from "axios";
//   from chatRequest.js
// const API = axios.create({ baseURL: "http://localhost:5000" });

// export const userChats = (id) => API.get(`/api/chat/${id}`);

export const userChats = (id) => axios.get(`/api/chat/${id}`);

export const createChat = async (chatData) => {
  try {
    console.log("Chat Data ====>", chatData);
    const response = await axios.post("/api/chat", chatData);
    console.log('response data from chat request  ======>',response.data)
    return response.data;
    
  } catch (error) {
    console.error("Error creating chat :", error);
  }
};
