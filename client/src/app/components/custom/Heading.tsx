import React from "react";
type Props = {
  children: React.ReactNode;
  size?: string;
  weight?: string;
};
const Heading: React.FC<Props> = ({
  children,
  size = "text-3xl",
  weight = "font-medium",
}) => {
  return (
    <h1 className={`text-[var(--text-primary)] ${size} ${weight}`}>
      {children}
    </h1>
  );
};
export default Heading;
