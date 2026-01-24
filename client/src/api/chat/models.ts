import { api } from "@/api/";
import type { AxiosError } from "axios";
import type { IModels } from "@/shared/types/models.interface";

interface ErrorResponse {
  message?: string;
}

const getModels = async (): Promise<IModels> => {
  try {
    const baseURL = api.defaults.baseURL;
    console.log(baseURL);
    const response = await api.get<IModels>("/chat/models");
    return response.data;
  } catch (error: unknown) {
    console.error("getModels error:", error);
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message || "Не удалось загрузить модели",
    );
  }
};

export default getModels;