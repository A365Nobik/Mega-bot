import React from "react";
import { Button, HomeIconLink,Paragraph } from "@/components/custom";
import Link from "next/link";

const Header = () => {
  const primaryBtnClass: string = "rounded-xl text-xl";
  return (
    <header className="w-full flex gap-2 px-2 py-4 animate-appear ">
      <div className="flex justify-center items-center gap-2">
        <HomeIconLink divClass="mr-auto ml-15" />
        <Paragraph className="text-xl font-medium">Mega-Bot</Paragraph>
      </div>
      <div className="ml-auto mr-5 flex justify-center items-center gap-2">
        <Button
          className={`${primaryBtnClass} p-1 bg-[var(--btn-primary)] text-[var(--btn-primary-text)]`}
        >
          <Link href={"/sign-in"}>Войти</Link>
        </Button>
        <Button
          className={`${primaryBtnClass} p-0.5 bg-[var(--btn-secondary)] border-[var(--text-primary)] border-2 border-solid text-[var(--btn-secondary-text)]`}
        >
          <Link href={"/sign-up"}>Зарегистрироваться</Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
