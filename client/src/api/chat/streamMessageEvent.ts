import type { ISteamResponse } from "@/shared/types/chat";
import type { IMessage } from "@/shared/types/chat";
import type { RefObject, SetStateAction, Dispatch } from "react";

export interface eventProps {
  event: ISteamResponse;
  setMessages: Dispatch<SetStateAction<IMessage[]>>;
  currentModelMessageIndexRef: RefObject<number>;
  scrollToTheEnd: () => void;
}

const streamMessageEvent = ({
  event,
  setMessages,
  currentModelMessageIndexRef,
  scrollToTheEnd,
}: eventProps) => {
  console.log("Stream event received:", event);
  const currentModel = event.model || undefined;

  switch (event.type) {
    case "start":
      const startMessage: IMessage = {
        sender: "assistant",
        text: event.message || `Начинаю обработку с модели ${currentModel}`,
        timestamp: new Date(),
        model: currentModel,
      };
      setMessages((prev) => {
        const newMessages = [...prev, startMessage];
        currentModelMessageIndexRef.current = newMessages.length - 1;
        return newMessages;
      });
      break;

    case "processing":
      const processingModel = event.model || undefined;
      setMessages((prev) => {
        const newMessages = [...prev];
        const index = currentModelMessageIndexRef.current;
        if (
          index >= 0 &&
          index < newMessages.length &&
          newMessages[index].model === processingModel
        ) {
          newMessages[index] = {
            ...newMessages[index],
            text: `Обработка моделью ${processingModel}...`,
            model: processingModel,
          };
        } else {
          const processingMessage: IMessage = {
            sender: "assistant",
            text: `Обработка моделью ${processingModel}...`,
            timestamp: new Date(),
            model: processingModel,
          };
          newMessages.push(processingMessage);
          currentModelMessageIndexRef.current = newMessages.length - 1;
        }
        return newMessages;
      });
      break;

    case "model_response":
      const responseModel = event.model || undefined;
      setMessages((prev) => {
        const newMessages = [...prev];
        const index = currentModelMessageIndexRef.current;
        if (
          index >= 0 &&
          index < newMessages.length &&
          newMessages[index].model === responseModel
        ) {
          newMessages[index] = {
            ...newMessages[index],
            text: event.response || "",
            model: responseModel,
          };
        } else {
          const responseMessage: IMessage = {
            sender: "assistant",
            text: event.response || "",
            timestamp: new Date(),
            model: responseModel,
          };
          newMessages.push(responseMessage);
          currentModelMessageIndexRef.current = newMessages.length - 1;
        }
        return newMessages;
      });
      break;

    case "redirect":
      const redirectMessage: IMessage = {
        sender: "assistant",
        text:
          event.message ||
          `Перенаправление с ${event.from_model} на ${event.to_model}`,
        timestamp: new Date(),
        model: event.to_model || undefined,
      };
      setMessages((prev) => {
        const newMessages = [...prev, redirectMessage];
        const newModelMessage: IMessage = {
          sender: "assistant",
          text: `Обработка моделью ${event.to_model}...`,
          timestamp: new Date(),
          model: event.to_model || undefined,
        };
        newMessages.push(newModelMessage);
        currentModelMessageIndexRef.current = newMessages.length - 1;
        return newMessages;
      });
      break;

    case "final":
      setMessages((prev) => {
        const newMessages = [...prev];
        const index = currentModelMessageIndexRef.current;
        if (index >= 0 && index < newMessages.length) {
          newMessages[index] = {
            ...newMessages[index],
            text: event.response || event.message || "",
            model: currentModel,
          };
        } else {
          const finalMessage: IMessage = {
            sender: "assistant",
            text: event.response || event.message || "",
            timestamp: new Date(),
            model: currentModel,
          };
          newMessages.push(finalMessage);
        }
        return newMessages;
      });
      break;

    case "error":
      setMessages((prev) => {
        const newMessages = [...prev];
        const index = currentModelMessageIndexRef.current;
        if (index >= 0 && index < newMessages.length) {
          newMessages[index] = {
            ...newMessages[index],
            text: event.message || "Произошла ошибка",
            model: currentModel,
          };
        } else {
          const errorMessage: IMessage = {
            sender: "assistant",
            text: event.message || "Произошла ошибка",
            timestamp: new Date(),
            model: currentModel,
          };
          newMessages.push(errorMessage);
        }
        return newMessages;
      });
      break;

    case "timeout":
      setMessages((prev) => {
        const newMessages = [...prev];
        const index = currentModelMessageIndexRef.current;
        if (index >= 0 && index < newMessages.length) {
          newMessages[index] = {
            ...newMessages[index],
            text: event.message || "Превышено время ожидания",
            model: currentModel,
          };
        } else {
          const timeoutMessage: IMessage = {
            sender: "assistant",
            text: event.message || "Превышено время ожидания",
            timestamp: new Date(),
            model: currentModel,
          };
          newMessages.push(timeoutMessage);
        }
        return newMessages;
      });
      break;

    default:
      const defaultMessage: IMessage = {
        sender: "assistant",
        text: event.message || "",
        timestamp: new Date(),
        model: currentModel,
      };
      setMessages((prev) => [...prev, defaultMessage]);
  }

  setTimeout(() => scrollToTheEnd(), 0);
};

export default streamMessageEvent;
