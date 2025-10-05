import type { IText } from "@/shared/types/text.interface";

interface Props {
  text?: IText;
  children: React.ReactNode;
}
const Heading = ({ text, children }: Props) => {
  return (
    <h1
      className={`font-mako ${text?.color || "text-[var(--text-primary)]"} ${
        text?.size || "text-2xl"
      } ${text?.weight || "font-medium"} ${text?.className || ""}`}
    >
      {children}
    </h1>
  );
};
export default Heading;
