import axios from "axios";
import { store } from "@/store";
import { setCredentials, logout } from "@/store/slices/authSlice";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_API;
const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const access_token = store.getState().auth.access_token;
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

// Optional: Add response interceptor to auto-refresh token
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${baseURL}/refresh`,
          {},
          {
            withCredentials: true,
          }
        );
        // Store new access_token in Redux
        const newAccessToken = refreshResponse.data.access_token;
        store.dispatch(
          setCredentials({ user: {}, access_token: newAccessToken })
        );
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        window.location.href = "/signin";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
