import type { IText, TextDefaults } from "@/shared/types/text.interface";
import { memo } from "react";

const textDefaults: TextDefaults = {
  size: "text-3xl",
  responseSize: true,
};

interface Props {
  text?: IText;
  children: React.ReactNode;
}
const Heading = memo(({ text, children }: Props) => {
  const config = { ...textDefaults, ...text };

  return (
    <h1
      className={`font-mako 
        ${config.color || "text-(--text-primary)"} 
        ${config.size} 
        ${config.responseSize ? "max-xl:text-lg" : ""} 
        ${config.weight || ""} 
        ${config.className || ""}`}
    >
      {children}
    </h1>
  );
});
Heading.displayName = "Heading";
export default Heading;
