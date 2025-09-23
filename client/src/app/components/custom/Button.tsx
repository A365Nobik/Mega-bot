import React from "react";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

const Button: React.FC<Props> = ({ className, children }) => {
  return (
    <button className={`${className} transition-all delay-100 duration-150  hover:-translate-y-1 font-mako font-medium`}>
      {children}
    </button>
  );
};
export default Button;
