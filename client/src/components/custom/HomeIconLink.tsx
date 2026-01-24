import MainIcon from "@/assets/svg/MainIcon";
import Link from "next/link";
import { memo } from "react";

interface IProps {
  divClass?: string;
  iconClass?: string;
  w?: number;
  h?: number;
}

const HomeIconLink = memo(({ divClass, iconClass, w = 32, h = 32 }: IProps) => {
  return (
    <div
      className={`transition-all delay-100 duration-150 hover:-translate-y-1 text-[var(--text-primary)] hover:text-[var(--icon-hover-primary)] ${divClass}`}
    >
      <Link href="/">
        <MainIcon className={iconClass} w={w} h={h} />
      </Link>
    </div>
  );
});

HomeIconLink.displayName = "HomeIconLink";
export default HomeIconLink;
