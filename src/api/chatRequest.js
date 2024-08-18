import axios from "axios";

// const API = axios.create({ baseURL: "http://localhost:5000" });

// export const userChats = (id) => API.get(`/api/chat/${id}`);

export const userChats = (id) => axios.get(`/api/chat/${id}`);
