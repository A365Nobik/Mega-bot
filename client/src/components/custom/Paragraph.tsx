import { memo } from "react";
import type { IText, TextDefaults } from "@/shared/types/text.interface";

interface Props {
  text?: IText;
  children: React.ReactNode;
}
const textDefaults: TextDefaults = {
  size: "text-lg",
  responseSize: true,
};
const Paragraph = memo(({ text, children }: Props) => {
  const config = { ...textDefaults, ...text };

  return (
    <p
      className={`font-mako 
        ${config.color || "text-(--text-primary)"} 
        ${config.size} 
        ${config.responseSize ? "max-xl:text-sm" : ""} 
        ${config.weight || ""} 
        ${config.className || ""}`}
    >
      {children}
    </p>
  );
});
Paragraph.displayName = "Paragraph";
export default Paragraph;
