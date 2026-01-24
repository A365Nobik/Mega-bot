import { memo } from "react";

interface IProps {
  children: React.ReactNode;
  className?: string;
  scale?: string;
  onClick?: () => void;
  defaultActive?: boolean;
}

const MainIconBlock = memo(
  ({
    children,
    className,
    scale = "text-3xl",
    onClick,
    defaultActive = true,
  }: IProps) => {
    return (
      <div
        onClick={onClick}
        className={`${scale} text-[var(--text-primary)] ${
          defaultActive ? `active:scale-90 active:duration-75` : ``
        } ${className}`}
      >
        {children}
      </div>
    );
  },
);
MainIconBlock.displayName = "MainIconBlock";
export default MainIconBlock;
