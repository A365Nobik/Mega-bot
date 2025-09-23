import React from "react";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

const Paragraph: React.FC<Props> = ({ className, children }) => {
  return (
    <p className={`text-[var(--text-primary)] ${className}`}>{children}</p>
  );
};

export default Paragraph;
