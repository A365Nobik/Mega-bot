import type { IHistoryItem } from "./historyItem.interface";

export interface ISSEEvent {
  type: "start" | "processing" | "model_response" | "final";
  message: string | null;
  model: string | null;
  response: string | null;
  response_type: string | null;
  iteration: number | null;
  from_model: string | null;
  to_model: string | null;
  timestamp: string;
  history: IHistoryItem[] | null;
}
