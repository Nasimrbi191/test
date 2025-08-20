import axios from "axios";

const api = axios.create({
  baseURL: "https://mahoorism.com/api/", // 🌍 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
