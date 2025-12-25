import { api } from "@/api/";
import type { IModels } from "@/shared/types/models.interface";

const getModels = async (): Promise<IModels> => {
  try {
    const baseURL = api.defaults.baseURL;
    console.log(baseURL)
    const response = await api.get("/chat/models");
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

export default getModels;
