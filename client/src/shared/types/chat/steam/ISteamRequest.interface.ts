import type { Models } from "../models.type";

export interface IStreamRequest {
  prompt: string;
  session_id: string;
  starting_model: Models;
}


