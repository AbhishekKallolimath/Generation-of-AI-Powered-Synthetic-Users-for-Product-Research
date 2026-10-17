import axios from "axios";

const api = axios.create({
  baseURL: "https://generation-of-ai-powered-synthetic-users-vdnr.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;