import type { Models } from "../models.type";
import type { StreamType } from "./SteamType.type";
import type { StreamResponse } from "./StreamResponseType.type";
import type { IHistoryItem } from "../historyItem.interface";
import type { Timestamp } from "../../timestamp.Type";

export interface ISteamResponse {
  type: StreamType;
  message: string | null;
  model: Models | null;
  response: string | null;
  response_type: StreamResponse | null;
  iteration: number | null;
  from_model: Models | null;
  to_model: Models | null;
  timestamp: Timestamp;
  history: IHistoryItem[] | null;
}
