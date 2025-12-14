import type { IText } from "@/shared/types/text.interface";

interface Props {
  text?: IText;
  children: React.ReactNode;
}
const Heading = ({ text={size:"text-3xl"}, children }: Props) => {
  return (
    <h1
      className={`font-mako ${text?.color || "text-[var(--text-primary)]"} ${
        text?.size
      } ${text?.weight} ${text?.className || ""}`}
    >
      {children}
    </h1>
  );
};
export default Heading;
