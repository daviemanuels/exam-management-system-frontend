import axios from "axios";
import { getCookieClient } from "@/lib/cookieClient";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// 🔥 Interceptor pra enviar token automaticamente
api.interceptors.request.use((config) => {
  const token = getCookieClient();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
