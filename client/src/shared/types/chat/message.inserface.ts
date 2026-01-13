import type { Timestamp } from "../timestamp.Type";

export interface IMessage {
  sender: "user" | "assistant";
  model?: string | null;
  timestamp: Timestamp;
  text: string | null;
}


