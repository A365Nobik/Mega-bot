import React from "react";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

const Button: React.FC<Props> = ({ className, children }) => {
  return (
    <button className={`${className} hover:drop-shadow(2xl_var(--text-primary)) transition-all duration-150 hover:-translate-y-1 font-mako font-medium`}>
      {children}
    </button>
  );
};
export default Button;
