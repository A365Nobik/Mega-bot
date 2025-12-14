import type { IText } from "@/shared/types/text.interface";

interface Props {
  text?: IText;
  children: React.ReactNode;
}
const Paragraph = ({
  text = {
    size: "text-lg",
  },
  children,
}: Props) => {
  return (
    <p
      className={`font-mako ${text.color || "text-[var(--text-primary)]"} ${text.size} ${
        text.weight
      } ${text.className}`}
    >
      {children}
    </p>
  );
};

export default Paragraph;
