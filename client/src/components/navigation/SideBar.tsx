"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo, memo } from "react";
import { Sidebar, ArrowDown, PlusCircle } from "@deemlol/next-icons";
import { MainIconBlock, Paragraph, Heading, Button } from "@/components/custom";
import MainIcon from "@/assets/svg/MainIcon";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useChatHistory } from "@/provider/HistoryProvider";
import { Trash } from "@deemlol/next-icons";
import { ModalConfirm } from "@/components/modal";
import type { ChangeEvent } from "react";

const SideBar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatsOpen, setChatsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hoveredChatKey, setHoveredChatKey] = useState<string | null>(null);
  const chatBlockRef = useRef<HTMLDivElement | null>(null);
  const openChats = () => setChatsOpen((prev) => !prev);
  const openSideBar = () => setIsOpen((prev) => !prev);
  const params = useParams();
  const router = useRouter();
  const { history, refreshHistory } = useChatHistory();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      refreshHistory();
    }
  }, [refreshHistory]);

  const filteredHistory = useMemo(() => {
    if (!history || !searchQuery.trim()) {
      return history || [];
    }
    const query = searchQuery.toLowerCase().trim();
    return history.filter((key) => {
      const parts = key.split(",");
      const chatName = parts.slice(1).join(",").toLowerCase();
      return chatName.includes(query);
    });
  }, [history, searchQuery]);

  const deleteChats = () => {
    const themeVal = localStorage.getItem("theme");
    localStorage.clear();
    if (themeVal) {
      localStorage.setItem("theme", themeVal);
    } else {
      localStorage.setItem("theme", "system");
    }
    refreshHistory();
    router.replace("/");
    location.reload();
  };

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

  const deleteChat = (key: string) => {
    localStorage.removeItem(key);
    router.replace("/");
    location.reload();
  };

  return (
    <>
      <aside className="h-screen fixed">
        <motion.nav
          initial={{ width: 64 }}
          animate={{ width: isOpen ? 256 : 64 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`h-full bg-(--bg-secondary) flex flex-col justify-center items-start p-2 ease-in-out animate-side-appear gap-6 overflow-hidden`}
        >
          <div className="flex flex-col justify-center items-center gap-2 mb-auto w-full">
            <div className="flex items-center justify-between w-full">
              <motion.span
                className="flex items-center gap-2"
                initial={{ x: -120 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                animate={{ x: isOpen ? 5 : -120 }}
              >
                <MainIconBlock>
                  <MainIcon h={24} w={24} />
                </MainIconBlock>
                <Heading text={{ size: "text-2xl" }}>Mega-Bot</Heading>
              </motion.span>
              <motion.span
                initial={{ x: -100 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                animate={{ x: isOpen ? -5 : -100 }}
              >
                <MainIconBlock onClick={openSideBar}>
                  <Sidebar size={32} />
                </MainIconBlock>
              </motion.span>
            </div>
            <Button
              hover="hover:bg-(--bg-primary)"
              defaultHover={false}
              className="flex justify-center items-center w-full p-1 rounded-lg gap-2"
            >
              <a href={"/"}>
                <PlusCircle size={24} />
              </a>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <Paragraph text={{ size: "text-xl" }}>
                      <a href={"/"}>Новый чат</a>
                    </Paragraph>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 100 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={`w-full flex flex-col items-start overflow-auto flex-1 gap-2 rounded-xl `}
          >
            <div className="w-full group flex justify-between items-center ">
              <span
                onClick={openChats}
                className="flex items-center w-max cursor-pointer"
              >
                <Paragraph>Чаты</Paragraph>
                {history && history.length > 0 && (
                  <MainIconBlock
                    className={`scale-0 transition-transform duration-250 ${
                      !isChatsOpen ? "rotate-180" : ""
                    } group-hover:scale-100`}
                  >
                    <ArrowDown size={20} />
                  </MainIconBlock>
                )}
              </span>
              {history && history.length > 0 && (
                <Button
                  title="Удалить все чаты"
                  defaultHover={false}
                  onClick={() => setDeleteModal(true)}
                  className="bg-red-700 p-1 rounded-lg"
                >
                  <MainIconBlock>
                    <Trash size={18} />
                  </MainIconBlock>
                </Button>
              )}
            </div>
            {isOpen && history && history.length > 0 && (
              <motion.input
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                type="text"
                placeholder="Поиск по чатам..."
                value={searchQuery}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(event.target.value)
                }
                className="w-full p-2 rounded-lg bg-(--bg-primary)  text-(--text-primary) placeholder:text-(--text-secondary) outline-none border-1 focus:border-(--border-color-active) transition-colors"
              />
            )}
            {filteredHistory && filteredHistory.length > 0 ? (
              <div
                ref={chatBlockRef}
                className={`bg-(--bg-primary) p-2 rounded-xl flex flex-col gap-1 w-full transition-opacity duration-250 ease-in-out`}
              >
                {filteredHistory.map((el, index) => {
                  const parts = el.split(",");
                  const sessionId = parts[0];
                  const chatName =
                    parts.slice(1).join(",") || `Чат ${index + 1}`;
                  const isActive =
                    (Array.isArray(params.id)
                      ? params.id[0]
                      : params.id
                    )?.toString() === sessionId;
                  const isHovered = hoveredChatKey === el;

                  return (
                    <motion.div
                      key={index}
                      onMouseEnter={() => setHoveredChatKey(el)}
                      onMouseLeave={() => setHoveredChatKey(null)}
                      className={`group relative flex items-center justify-between text-(--text-primary) w-full rounded-lg p-2 transition-all ${
                        isActive
                          ? "bg-(--bg-secondary) border-1 border-(--border-color-active)"
                          : "hover:bg-(--bg-secondary)"
                      }`}
                    >
                      <Link
                        href={`/${sessionId}`}
                        className="flex-1 overflow-hidden"
                      >
                        <Paragraph>{chatName.length>20?`${chatName.slice(0, 20)}...`:`${chatName}`}</Paragraph>
                      </Link>
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: 10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: 10 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Button
                              title="Удалить чат"
                              defaultHover={false}
                              onClick={() => {
                                deleteChat(el);
                              }}
                              className="bg-red-700 hover:bg-red-600 p-1 rounded-lg ml-2"
                            >
                              <MainIconBlock>
                                <Trash size={16} />
                              </MainIconBlock>
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            ) : history && history.length > 0 ? (
              <div className="bg-(--bg-primary) p-2 rounded-xl">
                <Paragraph>Чаты не найдены</Paragraph>
              </div>
            ) : (
              <div className="bg-(--bg-primary) p-2 rounded-xl">
                <Heading>У вас пока нет чатов</Heading>
              </div>
            )}
          </motion.div>
        </motion.nav>
      </aside>

      {deleteModal && (
        <ModalConfirm
          closeText="Закрыть"
          actionText="Удалить"
          questions="Вы действительно хотите удалить все чаты?"
          setOpenState={setDeleteModal}
          openState={deleteModal}
          confirmAction={deleteChats}
        />
      )}
    </>
  );
});
SideBar.displayName = "SideBar";
export default SideBar;
