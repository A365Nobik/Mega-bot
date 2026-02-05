import type { IText } from "@/shared/types/text.interface";
import type { ButtonHTMLAttributes } from "react";
import { memo } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  text?: IText;
  bg?: string;
  defaultHover?: boolean;
  hover?: string;
  defaultActive?: boolean;
  active?: string;
}

const Button = memo(
  ({
    className,
    children,
    hover,
    disabled,
    active,
    defaultHover = true,
    defaultActive = true,
    text,
    bg,
    ...restProps
  }: IProps) => {
    return (
      <button
        disabled={disabled}
        {...restProps}
        className={`
        ${
          defaultHover ? "delay-100 duration-150 hover:-translate-y-1" : hover
        } ${
          defaultActive ? "active:scale-90 active:duration-75" : active
        } font-mako transition-all cursor-pointer ${
          text?.color || "text-(--text-primary)"
        } ${text?.size || "text-lg"} ${text?.weight || "font-medium"} ${
          bg || ""
        } ${className || ""}`}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
export default Button;
