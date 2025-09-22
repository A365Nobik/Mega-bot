import React from "react";
import { Button, HomeIconLink } from "../../custom";
import { Link } from "react-router";

const Header: React.FC = () => {
  return (
    <header className="w-full mx-auto flex gap-2 px-2 py-4">
      <HomeIconLink divClass="mr-auto ml-15" />
      <div className="ml-auto mr-5 flex justify-center items-center gap-2">
        <Button className="p-1 bg-[var(--btn-primary)] rounded-xl text-lg text-[var(--btn-secondary)]">
          <Link to={"/sign-in"}>Войти</Link>
        </Button>
        <Button className="p-1 bg-[var(--btn-secondary)] rounded-xl border-[var(--text-primary)] border-2 border-solid text-lg text-[var(--text-primary)]">
          <Link to={"/sign-up"}>Зарегистрироваться</Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
