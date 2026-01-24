import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL + "/api/v1",
  timeout: 5000,
});

export default api;
