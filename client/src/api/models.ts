import axios from "axios";
// import { api } from "./";
import type { IModels } from "@/shared/types/models.interface";

const getModels = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/v1/chat/models"
    );
    const data: IModels = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error;
  }
};

export default getModels;
