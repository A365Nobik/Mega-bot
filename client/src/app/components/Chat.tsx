import React from "react";
import { Heading } from "./custom";
import DefaultChatForm from "./forms/DefaultChatForm";
import MainIcon from "@/assets/MainIcon";
type Props = {
  children?: React.ReactNode;
};

const Chat: React.FC<Props> = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <div className="flex justify-center items-center gap-2">
        <MainIcon className="text-[var(--text-primary)]" w={64} h={64} />
        <Heading weight="font-black" size="text-4xl">
          Задавайте любой вопрос
        </Heading>
      </div>
      <DefaultChatForm />
    </div>
  );
};

export default Chat;
