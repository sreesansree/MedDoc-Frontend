import axios from "axios";

const api = axios.create({
  baseURL: "https://meddoc-backend-cqw0.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
