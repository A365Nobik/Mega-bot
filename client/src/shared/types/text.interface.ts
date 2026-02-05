export interface IText {
  size?: string;
  weight?: string;
  className?: string;
  color?: string;
  responseSize?: boolean;
}

export type TextDefaults = Required<Pick<IText, "size" | "responseSize">>;
