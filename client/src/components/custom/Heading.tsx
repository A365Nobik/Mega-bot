interface IProps {
  children: React.ReactNode;
  size?: string;
  weight?: string;
  className?: string;
}
const Heading = ({
  children,
  size = "text-3xl",
  weight = "font-medium",
  className,
}: IProps) => {
  return (
    <h1 className={`text-[var(--text-primary)] ${size} ${weight} ${className}`}>
      {children}
    </h1>
  );
};
export default Heading;
