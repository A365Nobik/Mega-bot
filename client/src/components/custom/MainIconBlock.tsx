interface IProps {
  children: React.ReactNode;
  className?: string;
  scale?: string;
  onClick?: () => void;
  defaultActive?: boolean;
}

const MainIconBlock = ({
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
};

export default MainIconBlock;
