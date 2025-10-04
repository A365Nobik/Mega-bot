import type { IText } from "@/shared/types/text.interface";
import type { ChangeEvent } from "react";

interface Props {
  text?: IText;
  w?: number | string;
  h?: number | string;
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}
const TextArea = ({
  text = {
    size: "lg",
    weight: "medium",
    color: "[var(--text-primary)]",
  },
  w = "auto",
  h = "auto",
  placeholder,
  onChange,
}: Props) => {
  return (
    <textarea
      onChange={onChange}
      spellCheck
      className={`outline-none resize-none border-1 border-[var(--border-color)] text-${text.color} w-${w} h-${h} font-${text?.weight} text-${text?.size}  ${text?.className}`}
      name=""
      id=""
      placeholder={placeholder}
    ></textarea>
  );
};
export default TextArea;
