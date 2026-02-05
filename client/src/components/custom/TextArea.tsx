import type { IText, TextDefaults } from "@/shared/types/text.interface";
const textDefaults: TextDefaults = {
  size: "text-md",
  responseSize: true,
};
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
      const config = { ...textDefaults, ...text };

      return (
        <textarea
          ref={ref}
          spellCheck
          className={`outline-none resize-none 
            ${config.color || "text-(--text-primary)"} 
            ${w} ${h} ${bg} 
            ${config.weight || "font-normal"} 
            ${config.size} 
            ${config.responseSize ? "max-xl:text-sm" : ""} 
            ${config.className || ""}`}
          {...props}
        />
      );
    },
  ),
);

TextArea.displayName = "TextArea";
export default TextArea;
