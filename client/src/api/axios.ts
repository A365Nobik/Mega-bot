import axios from "axios";

const baseApiURL = process.env.NEXT_BASE_API_URL;

const api = axios.create({
  baseURL: baseApiURL,
});

export default api;
