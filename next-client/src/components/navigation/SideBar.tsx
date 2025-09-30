"use client";
import { useState } from "react";
import { Sidebar, Settings, ArrowDown } from "@deemlol/next-icons";
import { HomeIconLink, MainIconBlock, Paragraph } from "@/components/custom";
import MainIcon from "@/assets/svg/MainIcon";
import Link from "next/link";
import Image from "next/image";

const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatsOpen, setChatsOpen] = useState(true);

  const openChats = () => {
    setChatsOpen(!isChatsOpen);
  };

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
        <MainIconBlock onClick={openSideBar}>
          <Sidebar size={32} />
        </MainIconBlock>
      </div>
      {isOpen && (
        <div className="flex flex-col items-start overflow-auto flex-1 w-full gap-2">
          <div
            onClick={openChats}
            className="group flex justify-center items-center "
          >
            <Paragraph>Чаты</Paragraph>
            <MainIconBlock
              className={`scale-0 transition-transform duration-250 ${
                !isChatsOpen ? "rotate-180" : ""
              } group-hover:scale-100`}
            >
              <ArrowDown size={20} />
            </MainIconBlock>
          </div>
          <div
            className={`flex flex-col gap-1 w-full transition-transform duration-250 ease-in-out ${
               !isChatsOpen ? "scale-y-0 origin-top" : "scale-y-100 origin-top"
            }`}
          >
            {Array(40)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className={`bg-[var(--bg-primary)] w-full rounded-lg p-2 hover:bg-[var(--btn-secondary)]`}
                >
                  <Paragraph>Чат {index}</Paragraph>
                </div>
              ))}
          </div>
        </div>
      )}
      <div className="mt-auto flex justify-center items-center">
        <MainIconBlock
          scale="text-5xl"
          className={`hover:rotate-90 duration-500`}
        >
          <Link href="/settings">
            <Settings size={32} />
          </Link>
        </MainIconBlock>
      </div>
      <div className="flex justify-center items-center gap-10 bg-[var(--bg-primary)]">
        {isOpen && (
          <p
            className={`text-[var(--text-primary)] text-xl animate-side-appear ${
              !isOpen ? "animate-side-disappear" : ""
            }`}
          >
            Логин
          </p>
        )}
        {/* <Image
          className="inset-0 rounded-full"
          width={64}
          height={64}
          src={"https://nashzelenyimir.ru/wp-content/uploads/2016/07/%D0%A1%D1%83%D1%81%D0%BB%D0%B8%D0%BA-%D1%84%D0%BE%D1%82%D0%BE-%D0%B6%D0%B8%D0%B2%D0%BE%D1%82%D0%BD%D0%BE%D0%B3%D0%BE-768x480.jpg"}
          alt="user-avatar"
        /> */}
      </div>
    </aside>
  );
};

export default SideBar;
