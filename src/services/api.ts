import axios from "axios";
import { getCookieClient } from "@/lib/cookieClient";

export const api = axios.create({
  baseURL: "http://localhost:3333",
});

// 🔥 Interceptor pra enviar token automaticamente
api.interceptors.request.use((config) => {
  const token = getCookieClient();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
