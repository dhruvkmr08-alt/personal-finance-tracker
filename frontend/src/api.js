import axios from "axios";

const api = axios.create({
  baseURL: "https://personal-finance-tracker-18lh.onrender.com/api",
});

api.interceptors.request.use((config) => {
 const token = localStorage.getItem("financeToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
