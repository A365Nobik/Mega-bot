import axios from "axios";

const baseApiURL = process.env.NEXT_BASE_API_URL;

export const api = axios.create({
  baseURL: baseApiURL,
});
