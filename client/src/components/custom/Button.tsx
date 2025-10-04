import type { IText } from "@/shared/types/text.interface";

interface IProps {
  children?: React.ReactNode;
  className?: string;
  text?: IText;
  bg?: string;
  defaultHover?: boolean;
  hover?: string;
  defaultActive?: boolean;
  active?: string;
}

const Button = ({
  className,
  children,
  hover,
  active,
  defaultHover = true,
  defaultActive = true,
  text = { size: "text-lg" },
  bg,
}: IProps) => {
  return (
    <button
      className={`
        flex
         justify-center items-center
        ${
          defaultHover
            ? "transition-all delay-100 duration-150  hover:-translate-y-1"
            : hover
        } ${
        defaultActive
          ? "transition-transform active:scale-90 active:duration-75"
          : active
      } font-mako ${text.color || "text-[var(--text-primary)]"} ${text.size} ${
        text.weight
      } ${bg} ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;
