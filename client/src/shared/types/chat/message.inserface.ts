import type { Timestamp } from "../timestamp.Type";
import type { StreamResponse } from "./steam/StreamResponseType.type";

export interface IMessage {
    sender: "user" | "assistant";
    model?: string | null;
    timestamp: Timestamp;
    text: string | null;
    response_type?: StreamResponse | null;
}