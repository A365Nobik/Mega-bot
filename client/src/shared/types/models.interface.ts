export interface IModel {
  last_response_time?: string;
  name: string;
  specialization: string;
  status: string;
}

export interface IModels {
  available: string[];
  models: Record<string, IModel>;
  total: number;
}
