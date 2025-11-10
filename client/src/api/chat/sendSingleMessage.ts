import type { AxiosError } from "axios";
import api from "../axios";
import type { ISingleResponse,ISingleRequest,Models } from "@/shared/types/chat";



const sendSingleMessage = async (
  props: ISingleRequest
): Promise<ISingleResponse> => {
    console.log(props)
  try {
    const response = await api.post<ISingleResponse>("http://localhost:8000/api/v1/chat/", {
      message: props.message.trim(),
      session_id: props.session_id,
      starting_model: props.starting_model,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const status = axiosError.response.status;
      const details =
        (axiosError.response.data as any)?.details ||
        axiosError.response.statusText;
      throw new Error(`Ошибка ${status}, ${details}`);
    } else if (axiosError.request) {
      throw new Error("Сервер не отвечает");
    } else {
      throw new Error(axiosError.message || "Неизвестная ошибка");
    }
  }
};

export default sendSingleMessage;
