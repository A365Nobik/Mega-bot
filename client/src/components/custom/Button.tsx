import type { IText } from "@/shared/types/text.interface";
import { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  text?: IText;
  bg?: string;
  defaultHover?: boolean;
  hover?: string;
  defaultActive?: boolean;
  disabled?: boolean;
  active?: string;
}

const Button = ({
  className,
  children,
  hover,
  disabled,
  active,
  defaultHover = true,
  defaultActive = true,
  text,
  bg,
  ...props
}: IProps) => {
  return (
    <button
      disabled={disabled}
      className={`
        ${
          defaultHover ? "delay-100 duration-150  hover:-translate-y-1" : hover
        } ${
        defaultActive ? "active:scale-90 active:duration-75" : active
      } font-mako transition-all cursor-pointer ${
        text?.color || "text-[var(--text-primary)]"
      } ${text?.size || "text-lg"} ${text?.weight || "font-medium"} ${
        bg || ""
      } ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
