"use client";
import { motion, AnimatePresence } from "framer-motion";

import { Heading, TextArea, Paragraph } from "./custom";
import { getWelcomeMessages } from "@/shared/constants/welcome-messages";
import { useState, useRef, useEffect } from "react";
import type { ChangeEvent } from "react";

interface Props {}

const Chat = ({}: Props) => {
  const [message, setMessage] = useState<string>("");
  const [welcome, setWelcome] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [isOverLength, setIsOverLength] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const inputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    if (message.length >= 1000) {
      setIsOverLength(true);
    } else {
      setIsOverLength(false);
    }
  }, [message]);

  useEffect(() => {
    setMounted(true);
    setWelcome(getWelcomeMessages());
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      {mounted && (
        <div className="flex flex-col justify-center items-start">
          <Heading text={{ size: "text-4xl", weight: "font-bold" }}>
            Привет (логин)!
          </Heading>
          <Heading>{welcome}</Heading>
        </div>
      )}
      <div className="flex flex-col justify-center items-start">
        <TextArea onChange={inputChange} placeholder="Напишите что-то" />
        <Paragraph text={{}}>{message.length}/2048</Paragraph>
      </div>
    </div>
  );
};

export default Chat;
