import React, { useState } from "react";
import { FiSidebar } from "react-icons/fi";
import { IoMdSettings } from "react-icons/io";
import devAvatar from "@/assets/dev-client-fldr/goopher.png";
import { HomeIconLink, MainIconBlock, Paragraph } from "../../custom";
import { Link } from "react-router";
import MainIcon from "@/assets/MainIcon";

const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openSideBar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <aside
      className={`h-screen ${
        isOpen ? "w-64" : "w-24"
      } bg-[var(--bg-secondary)] flex flex-col justify-center items-end p-4 transition-[width] duration-500 ease-in-out animate-side-appear gap-6`}
    >
      <div className="flex justify-center items-center gap-2 mb-auto">
        <MainIcon w={32} h={32} className="text-[var(--text-primary)]" />
        {isOpen && (
          <p
            className={`text-[var(--text-primary)] text-xl animate-side-appear ${
              !isOpen ? "animate-side-disappear" : ""
            }`}
          >
            Mega-bot
          </p>
        )}
        <MainIconBlock onClick={openSideBar} className="">
          <FiSidebar />
        </MainIconBlock>
      </div>
      {isOpen && (
        <div className="flex flex-col justify-center items-center mt-auto w-full h-auto overflow-auto">
          {Array(40)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="bg-gray-600 w-full h-20">Чат {index}</div>
            ))}
        </div>
      )}
      <div className="mt-auto flex justify-center items-center">
        <MainIconBlock
          scale="text-5xl"
          className={`hover:rotate-90 duration-550`}
        >
          <Link to="/settings">
            <IoMdSettings />
          </Link>
        </MainIconBlock>
      </div>
      <div className="flex justify-center items-center gap-10">
        {isOpen && (
          <p
            className={`text-[var(--text-primary)] text-xl animate-side-appear ${
              !isOpen ? "animate-side-disappear" : ""
            }`}
          >
            Логин
          </p>
        )}
        <img
          className="inset-0 rounded-full"
          width={64}
          height={64}
          src={devAvatar}
          alt="user-avatar"
        />
      </div>
    </aside>
  );
};

export default SideBar;
