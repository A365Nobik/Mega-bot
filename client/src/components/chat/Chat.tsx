"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "@deemlol/next-icons";
import { Heading, TextArea, Button } from "../custom";
import { getWelcomeMessages } from "@/shared/constants/welcome-messages";
import { useState, useRef, useEffect } from "react";
import { ModelsCard, Message } from "@/components/chat";
import type { ChangeEvent, KeyboardEvent } from "react";
import type { IMessage, Models } from "@/shared/types/chat";
import type { IModels } from "@/shared/types/models.interface";
import { sendSingleMessage, getModels } from "@/api";
import Select from "../custom/Select";

// interface Props {}

const Chat = () => {
  const maxLength = 2048;
  const [message, setMessage] = useState<string>("");
  const [welcome, setWelcome] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [oneMessageSended, setOneMessageSended] = useState(false);
  const [isOverLength, setIsOverLength] = useState(false);
  const [models, setModels] = useState<IModels | null>(null);
  const [startingModel, setStartingModel] = useState<Models | null>(null);
  const [textAreaHeight, setTextAreaHeight] = useState<string | number>("auto");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const testRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [hasContent, setHacContent] = useState<boolean>(false);
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  console.log(startingModel);
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };
  useEffect(() => {
    setTextAreaHeight(
      textAreaRef.current
        ? `${Math.min(textAreaRef?.current?.scrollHeight, 256)}px`
        : "auto"
    );
  }, [hasContent, message]);

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
    const fetchModels = async () => {
      try {
        const data = await getModels();
        setModels(data);
        if (data.available && data.available.length > 0) {
          setStartingModel(data.available[0] as Models);
        }
      } catch (error) {
        console.error(error);
        // setError(true);
      }
    };
    fetchModels();
  }, []);
  useEffect(() => {
    if (textAreaRef.current) {
      if (textAreaRef.current?.textLength > 0) {
        setHacContent(true);
      } else {
        setHacContent(false);
      }
    }
  }, [textAreaRef.current?.textLength]);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const sendMessage = async () => {
    if (startingModel) {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: message, timestamp: new Date() },
      ]);
      setHacContent(false);
      try {
        const data = await sendSingleMessage({
          message: message,
          starting_model: startingModel,
          session_id: "1",
        });
        if (data) {
          setTextAreaHeight("0px");
          setMessage("");
          setOneMessageSended(true);
          setMessages((prev) => [
            ...prev,
            {
              sender: "assistant",
              text: data.response,
              timestamp: new Date(),
              model: startingModel,
            },
          ]);
        }
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const sendMessageKey = async (event: KeyboardEvent) => {
    if (
      hasContent &&
      event.key === "Enter" &&
      !event.shiftKey &&
      models?.available.length !== 0
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  const sendMessageClick = async () => {
    if (hasContent) {
      sendMessage();
    }
  };
  const startingModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    console.log(startingModel);
    const value = event.target.value as Models;
    setStartingModel(value);
  };
  return (
    <div className="flex h-full flex-col justify-between items-center w-full overflow-y-scroll">
      {mounted && !oneMessageSended && (
        <div className="w-1/2 flex flex-col justify-start items-start gap-8 p-2">
          <Heading
            text={{
              size: "text-6xl",
              weight: "font-bold",
              className: "animate-appear-opacity",
            }}
          >
            Привет (логин)!
          </Heading>
          <Heading
            text={{ size: "text-6xl", className: "animate-appear-opacity" }}
          >
            {welcome}
          </Heading>
          <ModelsCard models={models} />
        </div>
      )}
      {oneMessageSended && (
        <div className="w-1/2 flex-1 border-2 flex flex-col gap-8">
          {messages.map((_, idx) => (
            <Message key={idx} message={messages[idx]} />
          ))}
        </div>
      )}
      <div
        id="text-area"
        className="w-full flex flex-col justify-end items-center"
      >
        <div
          className={`relative  w-1/2 h-auto flex items-end border transition-color duration-150 rounded-xl p-2 bg-[var(--bg-secondary)] animate-bottom-appear flex-shrink-0 ${
            isOverLength
              ? "border-red-500"
              : "border-[var(--border-color)] focus-within:border-[var(--border-color-active)]"
          }`}
        >
          <motion.div
            initial={{ height: "auto" }}
            animate={{
              height: hasContent ? textAreaHeight : "auto",
            }}
            transition={{
              delay: 0,
              duration: 0.2,
              ease: "easeInOut",
            }}
            className="w-full"
          >
            <TextArea
              onKeyDown={sendMessageKey}
              value={message}
              ref={textAreaRef}
              w={"w-full"}
              h={"h-full"}
              rows={1}
              bg="bg-transparent"
              onChange={handleChange}
              placeholder="Напишите что-нибудь..."
              text={{
                className: "overflow-y-auto max-h-64",
              }}
            />
          </motion.div>
          <div className="flex items-center gap-2">
            {/* для теста */}

            <div className="flex" ref={testRef}>
              <p>{startingModel}</p>
              <button onClick={() => setIsSelectOpen(!isSelectOpen)}>
                <ArrowUp />
              </button>
              {isSelectOpen && (
                <Select
                  bg="bg-[var(--bg-primary)]"
                  p="p-2"
                  gap="gap-2"
                  content={["Hello", "Buy", "Hey"]}
                  container={testRef.current}
                />
              )}
            </div>
            {/* {models?.available.length !== 0 && (
              <select
                className="text-[var(--text-primary)] bg-[var(--bg-primary)]"
                onChange={startingModelChange}
              >
                {models?.available.map((el, idx) => (
                  <option key={idx} value={el}>
                    {el}
                  </option>
                ))}
              </select>
            )} */}
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
                title={
                  models?.available.length !== 0
                    ? "Отправить запрос"
                    : "Нет доступных моделей"
                }
                onClick={sendMessageClick}
                disabled={
                  models?.available.length === 0 || !hasContent || isOverLength
                }
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
