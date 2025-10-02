interface IProps {
  children?: React.ReactNode;
  className?: string;
}

const Button = ({ className, children }: IProps) => {
  return (
    <button
      className={`${className} transition-all delay-100 duration-150  hover:-translate-y-1 font-mako font-medium`}
    >
      {children}
    </button>
  );
};
export default Button;
