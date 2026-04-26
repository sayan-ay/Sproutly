import axios from "axios";
import { useAuthStore } from "./auth/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearUser();
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  },
);

export { api };
