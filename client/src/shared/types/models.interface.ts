export type ModelStatus = "active" | "inactive" | "error";

export interface IModelInfo {
  name: string;
  status: ModelStatus;
  last_response_time: number | null;
  specialization: string;
}

export interface IModels {
  models: Record<string, IModelInfo>;
  total: number;
  available: string[];
}
