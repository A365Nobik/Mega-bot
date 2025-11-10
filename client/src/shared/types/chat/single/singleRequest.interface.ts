import type { Models } from "../models.type";

export interface ISingleRequest {
  message: string;
  session_id: string;
  starting_model: Models;
}
