import axios from "axios";



// const API = axios.create({ baseURL: "http://localhost:5000" });


export const getMessages = (id) => axios.get(`/api/messages/${id}`);
