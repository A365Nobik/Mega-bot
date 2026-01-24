import type { IText } from "@/shared/types/text.interface";
import { memo } from "react";

interface Props {
  text?: IText;
  children: React.ReactNode;
}
const Heading = memo(({ text={size:"text-3xl"}, children }: Props) => {
  return (
    <h1
      className={`font-mako ${text?.color || "text-[var(--text-primary)]"} ${
        text?.size
      } ${text?.weight} ${text?.className || ""}`}
    >
      {children}
    </h1>
  );
});
Heading.displayName = "Heading";
export default Heading;
