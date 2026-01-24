import type { IText } from "@/shared/types/text.interface";
import { forwardRef, memo } from "react";
import type { TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  text?: IText;
  w?: string;
  h?: string;
  bg?: string;
}

const TextArea = memo(
  forwardRef<HTMLTextAreaElement, Props>(
    ({ text, w = "w-auto", h = "h-auto", bg = "", ...props }, ref) => {
      return (
        <textarea
          ref={ref}
          spellCheck
          className={`outline-none resize-none
            ${text?.color || "text-[var(--text-primary)]"}
            ${w} ${h} ${bg}
            ${text?.weight || "font-medium"}
            ${text?.size || "text-lg"}
            ${text?.className || ""}`}
          {...props}
        />
      );
    },
  ),
);

TextArea.displayName = "TextArea";
export default TextArea;
