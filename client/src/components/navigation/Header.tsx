import React from "react";
import { Button, HomeIconLink, Paragraph } from "@/components/custom";
import Link from "next/link";

const Header = () => {
  const primaryBtnClass: string = "rounded-xl";
  return (
    <header className="w-full flex gap-2 px-2 py-4 animate-appear ">
      <div className="flex justify-center items-center gap-2">
        <HomeIconLink divClass="mr-auto ml-15" />
        <Paragraph text={{ size: "text-xl" }}>Mega-Bot</Paragraph>
      </div>
      <div className="ml-auto mr-5 flex justify-center items-center gap-2">
        <Button
          bg="bg-[var(--btn-primary)]"
          text={{ color: "text-[var(--btn-primary-text)]", size: "text-xl" }}
          className={`${primaryBtnClass} p-1`}
        >
          <Link href={"/sign-in"}>Войти</Link>
        </Button>
        <Button
          text={{ color: "text-[var(--btn-secondary-text)]", size: "text-xl" }}
          bg="bg-[var(--btn-secondary)]"
          className={`${primaryBtnClass} p-0.5 border-[var(--text-primary)] border-2 border-solid`}
        >
          <Link href={"/sign-up"}>Зарегистрироваться</Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
