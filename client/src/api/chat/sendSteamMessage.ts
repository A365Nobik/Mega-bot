import {api} from "@/api/";
import type { IStreamRequest, ISteamResponse } from "@/shared/types/chat";

type StreamCallback = (event: ISteamResponse) => void;
type StreamErrorCallback = (error: Error) => void;
type StreamCompleteCallback = () => void;

const sendSteamMessage = async (
  props: IStreamRequest,
  onEvent: StreamCallback,
  onError?: StreamErrorCallback,
  onComplete?: StreamCompleteCallback
): Promise<void> => {
  const baseURL = api.defaults.baseURL || "http://localhost:8000/api/v1";
  const url = `${baseURL}/chat/stream/${props.session_id}?prompt=${encodeURIComponent(
    props.prompt
  )}&starting_model=${encodeURIComponent(props.starting_model)}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "text/event-stream" },
    });
    if (!response.ok) {
      onError?.(new Error(`Ошибка запроса ${response.status}`));
      return;
    }
    if (!response.body) {
      onError?.(new Error("Тело ответа пустое"));
      return;
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          onComplete?.();
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const rawData = line.slice(6);
              const parsed = JSON.parse(rawData) as {
                session_id: string;
                event: ISteamResponse;
              };
              console.log("Parsed stream data:", parsed);
              if (parsed.event) {
                onEvent(parsed.event);
              } else {
                console.error("Event is missing in parsed data:", parsed);
              }
            } catch (parseError) {
              console.error("Ошибка парсинга:", parseError, "Raw line:", line);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error(String(error)));
  }
};

export default sendSteamMessage;
