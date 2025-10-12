import axios from "axios";

const baseApiURL = process.env.BASE_API_URL;

console.log(baseApiURL);
const api = axios.create({
  baseURL: baseApiURL,
});

export default api;
