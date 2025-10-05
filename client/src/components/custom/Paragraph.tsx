import type { IText } from "@/shared/types/text.interface";

interface Props {
  text?: IText;
  children: React.ReactNode;
}
const Paragraph = ({ text, children }: Props) => {
  return (
    <p
      className={`font-mako ${text?.color || "text-[var(--text-primary)]"} ${
        text?.size || "text-lg"
      } ${text?.weight || "font-medium"} ${text?.className || ""}`}
    >
      {children}
    </p>
  );
};

export default Paragraph;
