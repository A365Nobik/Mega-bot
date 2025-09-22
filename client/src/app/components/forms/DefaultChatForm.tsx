import { geminiTest } from "@/app/api/test/GeminiTest";
import React, { useState, useRef } from "react";
import { IoSend } from "react-icons/io5";
import Icon1Svg from "@/assets/icon1.svg?react";
type Props = {
  children?: React.ReactNode;
};
const DefaultChatForm: React.FC<Props> = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isSended, setIsSended] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [response, setResponse] = useState<string>("");
  const handleSend = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsPending(true);
    const value: string = textAreaRef?.current?.value.trim() || "";
    setIsSended(true);
    if (!value) {
      console.warn("Пустое значение запроса");
      return;
    }
    try {
      console.log(isPending);
      setResponse("");
      const responseText = await geminiTest(value);
      setResponse(responseText || "");
      if (responseText) {
        setIsPending(false);
      }
    } catch (error) {
      console.error(error);
    }
    const timer = setTimeout(() => {
      setIsSended(false);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  };

  return (
    <div>

    </div>
  );
};

export default DefaultChatForm;
