import type { Timestamp } from "../timestamp.Type";

interface Messages {
  sender: "user" | "assistant";
  model: string;
  text: string;
  response_type: string | null;
  timestamp: Timestamp;
}

export interface IHistoryItem {
  id: string;
  messages: Messages[];
}
