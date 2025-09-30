import MainIcon from "@/assets/svg/MainIcon";
import Link from "next/link";

interface Props  {
  divClass?: string;
  iconClass?: string;
  w?: number;
  h?: number;
};

const HomeIconLink: React.FC<Props> = ({
  divClass,
  iconClass,
  w = 32,
  h = 32,
}) => {
  return (
    <div
      className={`transition-all delay-100 duration-150 hover:-translate-y-1 text-[var(--text-primary)] hover:text-[var(--icon-hover-primary)] ${divClass}`}
    >
      <Link href="/">
        <MainIcon className={iconClass} w={w} h={h} />
      </Link>
    </div>
  );
};

export default HomeIconLink;
