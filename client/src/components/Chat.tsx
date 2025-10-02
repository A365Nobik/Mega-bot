"use client";

import { Heading } from "./custom";
import { getWelcomeMessages } from "@/shared/constants/welcome-messages";
import { ChangeEvent, useState, useRef } from "react";

interface IProps {}

const Chat = ({}: IProps) => {
  const [message, setMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Heading>{getWelcomeMessages()}</Heading>
      <input ref={inputRef} hidden onChange={inputChange} type="text" />
      <div
        onClick={() => inputRef.current?.click()}
        className="bg-red-500 w-10 h-10 p-10"
      >
        {message || "Введите запрос"}
      </div>
    </div>
  );
};

export default Chat;
