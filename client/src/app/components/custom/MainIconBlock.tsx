import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  scale?: string;
  onClick?:()=>void
};

const MainIconBlock: React.FC<Props> = ({
  children,
  className,
  scale = "text-3xl",
  onClick
}) => {
  return (
    <div onClick={onClick} className={`${scale} text-[var(--text-primary)] active:scale-90 active:duration-75 ${className}`}>
      {children}
    </div>
  );
};

export default MainIconBlock;
