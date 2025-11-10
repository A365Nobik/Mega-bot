import type { IHistoryItem } from "../historyItem.interface";

export interface ISingleResponse {
  response: string;
  session_id: string;
  status: "completed";
  conversation_history: IHistoryItem[];
  processing_time: 0;
}
