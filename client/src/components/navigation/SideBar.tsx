"use client";
import { useState, useRef, useEffect } from "react";
import { Sidebar, ArrowDown, PlusCircle } from "@deemlol/next-icons";
import { MainIconBlock, Paragraph, Button } from "@/components/custom";
import MainIcon from "@/assets/svg/MainIcon";
// import Link from "next/link";
import Image from "next/image";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatsOpen, setChatsOpen] = useState(true);
  const [showText, setShowText] = useState(false);
  const chatBlockRef = useRef<HTMLDivElement | null>(null);

  const openChats = () => setChatsOpen((prev) => !prev);
  const openSideBar = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (!isChatsOpen) {
      chatBlockRef.current?.classList.remove("opacity-100");
      chatBlockRef.current?.classList.add("opacity-0");
      const timer = setTimeout(() => {
        chatBlockRef.current?.classList.add("hidden");
      }, 250);
      return () => clearTimeout(timer);
    } else {
      chatBlockRef.current?.classList.remove("hidden");
      const timer = setTimeout(() => {
        chatBlockRef.current?.classList.remove("opacity-0");
        chatBlockRef.current?.classList.add("opacity-100");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isChatsOpen]);
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setShowText(false);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setShowText(true);
    }
  }, [isOpen]);
  return (
    <aside className="h-screen">
      <nav
        className={`${
          isOpen ? "w-64" : "w-16"
        } h-full bg-[var(--bg-secondary)] flex flex-col justify-center items-start p-2 transition-[width] duration-500 ease-in-out animate-side-appear gap-6 overflow-hidden`}
      >
        <div className="flex flex-col justify-center items-start gap-2 mb-auto w-full">
          <div className="relative group flex justify-between items-center w-full">
            <MainIcon
              w={32}
              h={32}
              className={`${
                !isOpen && "group-hover:opacity-0 duration-250"
              } text-[var(--text-primary)]`}
            />
            <MainIconBlock
              className={`${!isOpen && "hidden"}`}
              onClick={openSideBar}
            >
              <Sidebar size={32} />
            </MainIconBlock>
            {!isOpen && (
              <div
                className={`absolute opacity-0 top-2 left-2 group-hover:opacity-100 duration-250`}
              >
                <MainIconBlock
                  // className={`${isOpen && "hidden"}`}
                  onClick={openSideBar}
                >
                  <Sidebar size={32} />
                </MainIconBlock>
              </div>
            )}
          </div>
          <div
            className={`flex flex-col juistify-center items-center w-full hover:bg-[var(--bg-primary)] rounded-lg transition-colors`}
          >
            <Button defaultHover={false} className="p-1 gap-2">
              <PlusCircle />
              <Paragraph
                text={{
                  className: `transition-all ${!isOpen && "w-0"} ${
                    !showText && "hidden"
                  }`,
                }}
              >
                Новый чат
              </Paragraph>
            </Button>
          </div>
        </div>
        {/* {!isOpen && (
        <div className="flex flex-col justify-around items-center gap-2 mb-auto w-full">
          <div className="relative group flex flex-col justify-center items-center">
            <MainIcon
              w={32}
              h={32}
              className="absolute text-[var(--text-primary)] group-hover:opacity-0 duration-250"
            />
            <div className="absolute opacity-0 top-2 group-hover:opacity-100 duration-250">
              <MainIconBlock onClick={openSideBar}>
                <Sidebar size={32} />
              </MainIconBlock>
            </div>
          </div>
          <div className="flex-1 flex-col juistify-center items-start">
            <Button
              animation="transition-colors hover:bg-[var(--bg-primary)]"
              defaultAnim={false}
              className="p-1 rounded-lg "
            >
              <PlusCircle />
            </Button>
          </div>
        </div>
      )} */}

        <div
          className={`transition-[width] flex flex-col items-start overflow-auto flex-1 gap-2 ${
            !isOpen ? "w-0" : "w-full"
          }`}
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
            className={`bg-[var(--bg-primary)] p-2 rounded-xl flex flex-col gap-1 w-full transition-opacity duration-250 ease-in-out `}
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
        <div className="w-full flex justify-start items-center gap-10 rounded-lg transition-colors hover:bg-[var(--bg-primary)] duration-250 p-2">
          <div className="flex-none rounded-full overflow-hidden">
            <Image
              src="/dev-assets/dev-ava.png"
              alt="user-avatar"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <Paragraph
            text={{
              className: `text-xl animate-side-appear ${!isOpen && "w-0"}`,
            }}
          >
            Логин
          </Paragraph>
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;
