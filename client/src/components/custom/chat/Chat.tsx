"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "@deemlol/next-icons";
import { Heading, Paragraph, TextArea, Button, TextSwitch } from "..";
import { getWelcomeMessages } from "@/shared/constants/";
import { useState, useRef, useEffect, useCallback } from "react";
import { ModelsCard, Message } from "@/components/custom/chat";
import type { ChangeEvent, KeyboardEvent } from "react";
import type { IMessage, Models } from "@/shared/types/chat";
import type { IModels } from "@/shared/types/models.interface";
import { sendSingleMessage, getModels, sendSteamMessage } from "@/api";
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
        } catch (e) {
          console.error("Failed to parse history:", e);
        }
      }
    }
  }, [sessionId]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(event.target.value);
    },
    []
  );

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
    const fetchModels = async () => {
      try {
        const data = await getModels();
        setModels(data);
        if (data.available && data.available.length > 0) {
          setStartingModel(data.available[0] as Models);
        }
      } catch (error) {
        console.error(error);
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
        }
      } else {
        currentModelMessageIndexRef.current = -1;
        
        try {
          await sendSteamMessage(
            {
              prompt: message,
              starting_model: startingModel,
              session_id: sessionId,
            },
            (event) => {
              const currentModel = event.model || undefined;

              switch (event.type) {
                case "start":
                  const startMessage: IMessage = {
                    sender: "assistant",
                    text:
                      event.message ||
                      `Начинаю обработку с модели ${currentModel}`,
                    timestamp: new Date(),
                    model: currentModel,
                  };
                  setMessages((prev) => {
                    const newMessages = [...prev, startMessage];
                    currentModelMessageIndexRef.current = newMessages.length - 1;
                    return newMessages;
                  });
                  break;

                case "processing":
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const index = currentModelMessageIndexRef.current;
                    if (index >= 0 && index < newMessages.length) {
                      newMessages[index] = {
                        ...newMessages[index],
                        text: `Обработка моделью ${currentModel}...`,
                        model: currentModel,
                      };
                    } else {
                      const processingMessage: IMessage = {
                        sender: "assistant",
                        text: `Обработка моделью ${currentModel}...`,
                        timestamp: new Date(),
                        model: currentModel,
                      };
                      newMessages.push(processingMessage);
                      currentModelMessageIndexRef.current = newMessages.length - 1;
                    }
                    return newMessages;
                  });
                  break;

                case "model_response":
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const index = currentModelMessageIndexRef.current;
                    if (index >= 0 && index < newMessages.length) {
                      newMessages[index] = {
                        ...newMessages[index],
                        text: event.response || "",
                        model: currentModel,
                      };
                    } else {
                      const responseMessage: IMessage = {
                        sender: "assistant",
                        text: event.response || "",
                        timestamp: new Date(),
                        model: currentModel,
                      };
                      newMessages.push(responseMessage);
                      currentModelMessageIndexRef.current = newMessages.length - 1;
                    }
                    return newMessages;
                  });
                  break;

                case "redirect":
                  const redirectMessage: IMessage = {
                    sender: "assistant",
                    text: event.message || `Перенаправление с ${event.from_model} на ${event.to_model}`,
                    timestamp: new Date(),
                    model: event.to_model,
                  };
                  setMessages((prev) => {
                    const newMessages = [...prev, redirectMessage];
                    currentModelMessageIndexRef.current = newMessages.length - 1;
                    return newMessages;
                  });
                  break;

                case "final":
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const index = currentModelMessageIndexRef.current;
                    if (index >= 0 && index < newMessages.length) {
                      newMessages[index] = {
                        ...newMessages[index],
                        text: event.response || event.message || "",
                        model: currentModel,
                      };
                    } else {
                      const finalMessage: IMessage = {
                        sender: "assistant",
                        text: event.response || event.message || "",
                        timestamp: new Date(),
                        model: currentModel,
                      };
                      newMessages.push(finalMessage);
                    }
                    return newMessages;
                  });
                  break;

                case "error":
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const index = currentModelMessageIndexRef.current;
                    if (index >= 0 && index < newMessages.length) {
                      newMessages[index] = {
                        ...newMessages[index],
                        text: event.message || "Произошла ошибка",
                        model: currentModel,
                      };
                    } else {
                      const errorMessage: IMessage = {
                        sender: "assistant",
                        text: event.message || "Произошла ошибка",
                        timestamp: new Date(),
                        model: currentModel,
                      };
                      newMessages.push(errorMessage);
                    }
                    return newMessages;
                  });
                  break;

                case "timeout":
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const index = currentModelMessageIndexRef.current;
                    if (index >= 0 && index < newMessages.length) {
                      newMessages[index] = {
                        ...newMessages[index],
                        text: event.message || "Превышено время ожидания",
                        model: currentModel,
                      };
                    } else {
                      const timeoutMessage: IMessage = {
                        sender: "assistant",
                        text: event.message || "Превышено время ожидания",
                        timestamp: new Date(),
                        model: currentModel,
                      };
                      newMessages.push(timeoutMessage);
                    }
                    return newMessages;
                  });
                  break;

                default:
                  const defaultMessage: IMessage = {
                    sender: "assistant",
                    text: event.message || "",
                    timestamp: new Date(),
                    model: currentModel,
                  };
                  setMessages((prev) => [...prev, defaultMessage]);
              }

              setTimeout(() => scrollToTheEnd(), 0);
            },
            (error) => {
              console.error("Stream error:", error);
              setMessages((prev) => [
                ...prev,
                {
                  sender: "assistant",
                  text: `Ошибка: ${error.message}`,
                  timestamp: new Date(),
                },
              ]);
            }
          );
        } catch (error) {
          console.error(error);
        }
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
    const value = event.target.value as Models;
    setStartingModel(value);
  };

  return (
    <div
      ref={chatRef}
      className="flex h-7/8 flex-col justify-between items-center w-full overflow-y-scroll"
    >
      {mounted && !oneMessageSended && (
        <div className="w-1/2 flex flex-col justify-start items-start gap-8 p-4">
          <Heading
            text={{
              size: "text-6xl",
              className: "animate-appear-default-opacity delay-100",
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
        </div>
      )}
      <div
        id="text-area"
        className="w-full flex flex-col justify-end items-center"
      >
        <div
          className={`fixed bottom-5 z-10 w-1/2 h-auto grid items-end border transition-color duration-150 rounded-xl p-2 bg-(--bg-secondary) animate-bottom-appear shrink-0 ${
            isOverLength
              ? "border-red-500"
              : "border-(--border-color) focus-within:border-(--border-color-active)"
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
            className="flex-1"
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
          <div className="flex justify-end items-center gap-2 shrink-0">
            {models?.available?.length !== 0 && (
              <select
                title="Начальная модель"
                className="text-(--text-primary) text-lg transition-colors hover:bg-(--bg-primary) p-1 rounded-lg duration-200"
                onChange={startingModelChange}
              >
                {models?.available?.map((model, idx) => (
                  <option key={idx} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            )}
            <TextSwitch value={defaultRequest} setValue={setDefaultRequest}>
              <Paragraph text={{ size: "text-md" }}>Обычный запрос</Paragraph>
            </TextSwitch>
            <div
              className={`text-xl ${
                isOverLength
                  ? "text-red-500 animate-pulse"
                  : "text-(--text-primary)"
              }`}
            >
              {message.length}/{maxLength}
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
              className="rounded-full p-1 disabled:opacity-50 disabled:cursor-no-drop bg-(--btn-primary)"
            >
              <ArrowUp color="var(--btn-primary-text)" />
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {isOverLength && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -160 }}
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
