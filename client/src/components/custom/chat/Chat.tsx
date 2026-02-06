"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, X } from "@deemlol/next-icons";
import {
  Heading,
  Paragraph,
  TextArea,
  Button,
  TextSwitch,
  MainIconBlock,
} from "..";
import MainIcon from "@/assets/svg/MainIcon";
import { getWelcomeMessages } from "@/shared/constants/";
import { useState, useRef, useEffect, useCallback } from "react";
import { ModelsCard, Message, LoadingDots } from "@/components/custom/chat";
import type { ChangeEvent, KeyboardEvent } from "react";
import type { IMessage, Models } from "@/shared/types/chat";
import type { IModels } from "@/shared/types/models.interface";
import {
  sendSingleMessage,
  getModels,
  sendSteamMessage,
  streamEvent,
} from "@/api";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import { useChatHistory } from "@/provider/HistoryProvider";

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
  const chatRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [hasContent, setHacContent] = useState<boolean>(false);
  const [defaultRequest, setDefaultRequest] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const currentModelMessageIndexRef = useRef<number>(-1);
  const params = useParams();
  const { refreshHistory } = useChatHistory();

  useEffect(() => {
    setMounted(true);
    setWelcome(getWelcomeMessages());
    if (typeof window !== "undefined") {
      if (!params.id) {
        setSessionId(uuidv4());
      } else {
        const id = params.id.toString();
        setSessionId(id);
      }
    }
  }, [params.id]);

  useEffect(() => {
    if (typeof window === "undefined" || !sessionId) return;
    let historyKey: string | null = null;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(sessionId + ",")) {
        historyKey = key;
        break;
      }
    }

    if (historyKey) {
      const history = localStorage.getItem(historyKey);
      if (history) {
        try {
          setOneMessageSended(true);
          setMessages(JSON.parse(history));
        } catch (error) {
          console.error("Failed to parse history:", error);
          setErrors((prev) => [...prev, "Не удалось загрузить историю"]);
        }
      }
    }
  }, [sessionId]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(event.target.value);
    },
    [],
  );

  useEffect(() => {
    setTextAreaHeight(
      textAreaRef.current
        ? `${Math.min(textAreaRef?.current?.scrollHeight, 256)}px`
        : "auto",
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
    const fetchModels = async () => {
      try {
        const data = await getModels();
        setModels(data);
        if (data.available && data.available.length > 0) {
          setStartingModel(data.available[0] as Models);
        }
      } catch (error) {
        console.error(error);
        setErrors((prev) => [
          ...prev,
          "Не удалось загрузить модели, сервер недоступен",
        ]);
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    setHacContent(message.trim().length > 0);
  }, [message]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!oneMessageSended || !sessionId || messages.length === 0) return;

    const timeoutId = setTimeout(() => {
      let existingKey: string | null = null;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(sessionId + ",")) {
          existingKey = key;
          break;
        }
      }

      const name = existingKey || `${sessionId},${messages[0].text}`;

      if (!params.id) {
        window.history.replaceState(null, "", `/${sessionId}`);
      }

      localStorage.setItem(name, JSON.stringify(messages));
      refreshHistory();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [messages, oneMessageSended, sessionId, params.id, refreshHistory]);

  const scrollToTheEnd = useCallback(() => {
    chatRef.current?.scrollTo(0, chatRef.current?.scrollHeight);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToTheEnd();
    }
  }, [messages, scrollToTheEnd]);

  const clearChatAfterError = () => {
    console.log(message);
    const lastUserMsg = [...messages]
      .reverse()
      .find((msg) => msg.sender === "user");
    const lastUserText = lastUserMsg?.text ?? "";

    setMessages((prev) => {
      const newMessages = [...prev];
      return newMessages.slice(0, -1);
    });

    console.log(message);

    setMessage(lastUserText);
    if (textAreaRef.current) {
      console.log(1234);
      textAreaRef.current.textContent = message;
      textAreaRef.current.focus();
    }
  };

  const sendMessage = async () => {
    if (startingModel && startingModel.length > 0) {
      const userMessage: IMessage = {
        sender: "user",
        text: message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      scrollToTheEnd();
      setHacContent(false);
      setTextAreaHeight("0px");
      setMessage("");
      setOneMessageSended(true);
      setIsLoading(true);

      if (defaultRequest) {
        try {
          const data = await sendSingleMessage({
            message: message,
            starting_model: startingModel,
            session_id: sessionId,
          });

          if (data) {
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
          scrollToTheEnd();
        } catch (error) {
          console.error(error);
          setErrors((prev) => [
            ...prev,
            "Ошибка при отправке сообщения. Проверьте подключение к серверу.",
          ]);
          setMessages((prev) => [
            ...prev,
            {
              sender: "assistant",
              text: "Извините, произошла ошибка при обработке запроса. Пожалуйста, попробуйте еще раз.",
              timestamp: new Date(),
              model: startingModel,
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      } else {
        currentModelMessageIndexRef.current = -1;

        try {
          await sendSteamMessage(
            {
              prompt: message,
              starting_model: startingModel,
              session_id: sessionId,
              setMessages: setMessages,
              currentModelMessageIndexRef: currentModelMessageIndexRef,
              scrollToTheEnd: scrollToTheEnd,
              setIsLoading: setIsLoading,
            },
            streamEvent,
            (error) => {
              console.error("Stream error:", error);
              clearChatAfterError();
              setIsLoading(false);
              setErrors((prev) => [...prev, "Ошибка совещания моделей"]);
            },
          );
        } catch (error) {
          console.error(error);
          setIsLoading(false);
          setErrors((prev) => [
            ...prev,
            "Не удалось начать совещание моделей, сервер недоступен",
          ]);
        }
      }
    }
  };

  const sendMessageKey = async (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      if (!hasContent || models?.available.length === 0 || isOverLength) {
        event.preventDefault();
        return;
      }

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
    const value = event.target.value as Models;
    setStartingModel(value);
  };

  return (
    <div
      ref={chatRef}
      className="flex h-7/8 flex-col justify-between items-center w-full  overflow-y-scroll"
    >
      {mounted && !oneMessageSended && (
        <div className="w-1/2 max-xl:w-140 flex flex-col justify-start items-start gap-8 max-xl:gap-4 p-4">
          <Heading
            text={{
              size: "text-6xl max-xl:text-2xl",
              className: "animate-appear-default-opacity delay-100",
              responseSize: false,
            }}
          >
            {welcome}
          </Heading>
          <ModelsCard models={models} />
        </div>
      )}
      {oneMessageSended && (
        <div className="w-1/2 flex-1 flex flex-col gap-8">
          {messages.map((msg, idx) => {
            const messageKey = msg.timestamp
              ? `msg-${idx}-${msg.timestamp.toLocaleString()}`
              : `msg-${idx}`;
            return <Message key={messageKey} message={msg} />;
          })}
          {isLoading && (
            <div className="bg-(--bg-secondary) p-4 rounded-lg max-w-[80%] self-start">
              <div className="flex items-center gap-2">
                <MainIconBlock defaultActive={false}>
                  <MainIcon w={20} h={20}></MainIcon>
                </MainIconBlock>
                <Paragraph>Обработка...</Paragraph>
              </div>
              <div className="flex items-end gap-2 mt-2">
                <LoadingDots />
              </div>
            </div>
          )}
          {errors && (
            <div className="absolute top-5 right-5 h-auto overflow-y-auto grid items-center gap-2">
              <AnimatePresence>
                {errors.map((error, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
                    className="grid gap-2 items-center bg-red-500/20 border border-red-500 p-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Paragraph
                        text={{
                          color: "text-red-500",
                          weight: "font-semibold",
                        }}
                      >
                        {error}
                      </Paragraph>

                      <Button
                        onClick={() =>
                          setErrors((prev) => prev.filter((_, i) => i !== idx))
                        }
                      >
                        <X />
                      </Button>
                    </div>

                    <div className="w-full bg-white rounded-lg">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: "linear" }}
                        onAnimationComplete={() => {
                          setErrors((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="h-2 bg-(--border-color-active) rounded-lg"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
      <div
        id="text-area"
        className="w-full flex flex-col justify-end items-center"
      >
        <div
          className={`fixed bottom-5 max-xl:bottom-2 z-10 w-1/2 max-xl:w-140 h-auto grid items-end border transition-color duration-150 rounded-xl p-2 max-xl:p-1 bg-(--bg-secondary) animate-bottom-appear shrink-0 ${
            isOverLength
              ? "border-red-500"
              : "border-(--border-color) focus-within:border-(--border-color-active)"
          }`}
        >
          <div
            style={{ height: hasContent ? textAreaHeight : "auto" }}
            className="flex-1 transition-[height] duration-200 ease-in-out overflow-hidden"
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
                className:
                  "overflow-y-auto max-h-64 max-xl:max-h-32 block px-1",
                size: "text-lg max-xl:text-sm",
              }}
            />
          </div>
          <div className="flex justify-end items-center gap-2 max-xl:gap-1 shrink-0">
            {models && models?.available?.length !== 0 ? (
              <select
                title="Начальная модель"
                className="text-(--text-primary) text-lg max-xl:text-sm transition-colors hover:bg-(--bg-primary) p-1 max-xl:p-0 rounded-md duration-200"
                onChange={startingModelChange}
              >
                {models?.available?.map((model, idx) => (
                  <option key={idx} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            ) : (
              <Paragraph>Нет доступных моделей</Paragraph>
            )}
            {models && models?.available?.length !== 0 && (
              <div>
                <TextSwitch value={defaultRequest} setValue={setDefaultRequest}>
                  <Paragraph text={{ size: "text-lg" }}>Обычный</Paragraph>
                </TextSwitch>
              </div>
            )}
            <div>
              <Paragraph
                text={{
                  size: "text-lg",
                  className: `${isOverLength ? "text-red-500 animate-pulse" : "text-(--text-primary)"}`,
                }}
              >
                {message.length}/{maxLength}
              </Paragraph>
            </div>
            <Button
              title={
                models?.available?.length !== 0
                  ? "Отправить запрос"
                  : "Нет доступных моделей"
              }
              onClick={sendMessageClick}
              disabled={
                models?.available?.length === 0 ||
                !hasContent ||
                isOverLength ||
                !startingModel
              }
              defaultActive={models?.available?.length === 0}
              defaultHover={models?.available?.length === 0}
              className="rounded-full p-1 max-xl:p-0.5 disabled:opacity-50 disabled:cursor-no-drop bg-(--btn-primary)"
            >
              <ArrowUp color="var(--btn-primary-text)" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
