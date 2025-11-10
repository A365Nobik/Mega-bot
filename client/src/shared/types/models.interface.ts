import type { Models } from "./chat";
type Status = "active" | "inactive" | "error";
interface IModel {
  last_response_time?: string;
  name: string;
  specialization: string;
  status: Status;
}

export interface IModels {
  available:Models[];
  models: Record<string, IModel>;
  total: number;
}
