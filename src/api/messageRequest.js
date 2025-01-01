// import axios from "axios";
import api from "./renderApi.js";

// const API = axios.create({ baseURL: "http://localhost:5000" });

export const getMessages = (id) => api.get(`/api/messages/${id}`);

export const addMessages = (data) => api.post("/api/messages/", data);
