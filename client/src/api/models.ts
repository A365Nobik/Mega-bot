import { api } from "./";
import type { IModels } from "@/shared/types/models.interface";

const getModels = async (): Promise<IModels> => {
  try {
    const response = await api.get("http://localhost:8000/api/v1/chat/models");
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error;
  }
};

export default getModels;
