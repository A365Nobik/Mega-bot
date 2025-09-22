import React from "react";

type Props = {
  children?: React.ReactNode;
  className: string;
};

const defaultClass: string = "text-[var(--text-primary)] text-lg";

const Input: React.FC<Props> = ({ children, className }) => {
  return <input className={defaultClass + className}>{children}</input>;
};

export default Input;
