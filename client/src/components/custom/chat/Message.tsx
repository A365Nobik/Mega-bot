"use client";

import type { IMessage } from "@/shared/types/chat";
import { MainIconBlock, Paragraph } from "@/components/custom";
import { dateFormatter } from "@/shared/constants";
import MainIcon from "@/assets/svg/MainIcon";
import { User } from "@deemlol/next-icons";
import { memo, useEffect, useState } from "react";

interface IProps {
  message: IMessage;
}
const Message = memo(({ message }: IProps) => {
  const [sended, setSended] = useState<string>(
    dateFormatter(message.timestamp ? message.timestamp : "Ошибка даты")
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      setSended(
        dateFormatter(message.timestamp ? message.timestamp : "Ошибка даты")
      );
    }, 60000);
    return () => {
      clearTimeout(timer);
    };
  }, [message.timestamp]);

  return (
    <div
      className={`bg-(--bg-secondary) p-4 rounded-lg max-w-[80%] ${
        message.sender === "user" ? "self-end" : "self-start"
      }`}
    >
      <div className="flex items-center gap-2">
        <MainIconBlock>
          {message.sender === "user" ? (
            <User size={20} />
          ) : (
            <MainIcon w={20} h={20}></MainIcon>
          )}
        </MainIconBlock>
        <Paragraph>
          {message.sender === "user" ? "Вы" : message.model}
        </Paragraph>
      </div>
      <Paragraph>{message.text}</Paragraph>
      <Paragraph text={{ size: "text-sm" }}>{sended}</Paragraph>
    </div>
  );
});
Message.displayName = "Message";
export default Message;
