import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://snipit-8euj.onrender.com/", // ✅ change this later to production URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically (if available)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
