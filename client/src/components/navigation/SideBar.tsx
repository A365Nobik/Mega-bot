"use client";
import { useState, useRef, useEffect } from "react";
import { Sidebar, Settings, ArrowDown } from "@deemlol/next-icons";
import { MainIconBlock, Paragraph } from "@/components/custom";
import MainIcon from "@/assets/svg/MainIcon";
import Link from "next/link";
import Image from "next/image";

const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatsOpen, setChatsOpen] = useState(true);
  const chatBlockRef = useRef<HTMLDivElement | null>(null);

  const openChats = () => {
    setChatsOpen(!isChatsOpen);
  };

  const openSideBar = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    if (!isChatsOpen) {
      const timer = setTimeout(() => {
        chatBlockRef.current?.classList.add("hidden");
      }, 150);
      return () => clearTimeout(timer);
    } else {
      chatBlockRef.current?.classList.remove("hidden");
      // const timer = setTimeout(() => {
      //   chatBlockRef.current?.classList.add("opacity-100");
      // }, 150);
      // return () => clearTimeout(timer);
    }
  }, [isChatsOpen]);
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
        <div
          className={`flex flex-col items-start overflow-auto flex-1 w-full gap-2`}
        >
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
            ref={chatBlockRef}
            className={`bg-[var(--bg-primary)] p-2 rounded-xl flex flex-col gap-1 w-full transition-opacity duration-250 ease-in-out ${
              !isChatsOpen ? "opacity-0" : "opacity-100"
            }`}
          >
            {Array(40)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className={`w-full rounded-lg p-2 hover:bg-[var(--bg-secondary)] transition-transform active:scale-90 active:duration-75`}
                >
                  <Paragraph>Чат {index}</Paragraph>
                </div>
              ))}
          </div>
        </div>
      )}
      <div
        className="mt-auto mx-auto flex flex-col gap-2 w-full
          transition-all duration-500 justify-start items-start"
      >
        <div className="w-full flex justify-start items-center gap-10 p-2 rounded-lg transition-colors hover:bg-[var(--bg-primary)] duration-250">
          <span className="w-16 h-16 flex-none ">
            <Image
              src="/dev-assets/dev-ava.png"
              alt="user-avatar"
              width={64}
              height={64}
              className="rounded-full"
            />
          </span>
          {isOpen && (
            <Paragraph
              className={`text-xl animate-side-appear ${
                !isOpen ? "animate-side-disappear" : ""
              }`}
            >
              Логин
            </Paragraph>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
