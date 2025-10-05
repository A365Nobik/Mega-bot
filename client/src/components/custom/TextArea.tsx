import type { IText } from "@/shared/types/text.interface";
import { forwardRef } from "react";
import type { ChangeEvent, TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  text?: IText;
  w?: string;
  h?: string;
  bg?: string;
}
const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      text,
      w = "w-auto",
      h = "h-auto",
      bg,
      rows,
      placeholder,
      maxLength,
      minLength,
      onChange,
      ...props
    },
    ref
  ) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        maxLength={maxLength}
        minLength={minLength}
        onChange={onChange}
        spellCheck
        className={`outline-none resize-none ${
          text?.color || "text-[var(--text-primary)]"
        }
      } ${w} ${h} ${bg} ${text?.weight || "font-medium"} ${
          text?.size || "text-lg"
        }  ${text?.className}`}
        placeholder={placeholder}
        {...props}
      ></textarea>
    );
  }
);
TextArea.displayName = "TextArea";
export default TextArea;
