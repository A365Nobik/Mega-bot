"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "@deemlol/next-icons";
import { Heading, TextArea, Paragraph, Button } from "./custom";
import { getWelcomeMessages } from "@/shared/constants/welcome-messages";
import { useState, useRef, useEffect } from "react";
import type { ChangeEvent } from "react";

interface Props {}

const Chat = ({}: Props) => {
  const maxLength = 2048;
  const [message, setMessage] = useState<string>("");
  const [welcome, setWelcome] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [isOverLength, setIsOverLength] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    if (message.length >= maxLength) {
      setIsOverLength(true);
    } else {
      setIsOverLength(false);
    }
  }, [message]);

  useEffect(() => {
    setMounted(true);
    setWelcome(getWelcomeMessages());
  }, []);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${Math.min(
        textAreaRef.current.scrollHeight,
        256
      )}px`;
    }
  }, [message]);

  return (
    <div className="flex h-full flex-col justify-between items-center w-full overflow-hidden">
      {mounted && (
        <div className="w-1/2 flex flex-col justify-start items-start gap-8 p-2">
          <Heading text={{ size: "text-6xl", weight: "font-bold" }}>
            Привет (логин)!
          </Heading>
          <Heading text={{ size: "text-6xl" }}>{welcome}</Heading>
        </div>
      )}
      <div className="w-full flex flex-col justify-end items-center">
        <div
          className={`w-1/2 h-auto flex items-end border transition-color duration-150 rounded-xl p-2 bg-[var(--bg-secondary)] ${
            isOverLength
              ? "border-red-500"
              : "border-[var(--border-color)] focus-within:border-[var(--border-color-active)]"
          }`}
        >
          <TextArea
            ref={textAreaRef}
            w={"w-full"}
            h={"h-auto"}
            rows={1}
            bg="bg-transparent"
            onChange={handleChange}
            placeholder="Напишите что-нибудь..."
            maxLength={maxLength}
            text={{ className: "overflow-y-auto max-h-64" }}
          />
          <div className="flex items-center gap-2">
            <div
              className={`text-xl ${
                isOverLength
                  ? "text-red-500 animate-pulse"
                  : "text-[var(--text-primary)]"
              }`}
            >
              {message.length}/{maxLength}
            </div>
            <div className="flex justify-around items-center gap-2">
              <Button
                disabled={message.length === 0}
                bg="bg-[var(--btn-primary)]"
                className="rounded-full p-1 disabled:opacity-50 disabled:cursor-no-drop"
                defaultActive={message.length !== 0}
                defaultHover={message.length !== 0}
              >
                <ArrowUp color="var(--btn-primary-text)" />
              </Button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isOverLength && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-red-500 text-sm"
            >
              Превышена максимальная длина сообщения!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Chat;
