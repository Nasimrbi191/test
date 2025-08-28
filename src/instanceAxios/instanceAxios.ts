import axios from "axios";

interface ApiConfig {
  port: number;
}

const api = ({ port }: ApiConfig) => axios.create({
  baseURL: `http://localhost:${port}`, // 🌍 
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  },
});

export default api;