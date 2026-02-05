"use client";
import { Copy } from "@deemlol/next-icons";
import type { IMessage } from "@/shared/types/chat";
import { Button, MainIconBlock, Paragraph } from "@/components/custom";
import { dateFormatter } from "@/shared/constants";
import MainIcon from "@/assets/svg/MainIcon";
import { User } from "@deemlol/next-icons";
import { memo, useEffect, useState } from "react";

interface IProps {
  message: IMessage;
}
const Message = memo(({ message }: IProps) => {
  const [sended, setSended] = useState<string>(
    dateFormatter(message.timestamp ? message.timestamp : "Ошибка даты"),
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      setSended(
        dateFormatter(message.timestamp ? message.timestamp : "Ошибка даты"),
      );
    }, 60000);
    return () => {
      clearTimeout(timer);
    };
  }, [message.timestamp]);

  const copyMessage = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text);
    }
  };

  return (
    <div
      className={`bg-(--bg-secondary) p-4 max-xl:p-2 rounded-md max-w-[80%] ${
        message.sender === "user" ? "self-end" : "self-start"
      }`}
    >
      <div className="flex items-center gap-2">
        <MainIconBlock defaultActive={false}>
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
      <div className="flex items-end gap-2 group">
        <Paragraph>{message.text}</Paragraph>
        <Button
          text={{ size: "text-sm" }}
          className="opacity-0 scale-0 duration-300 delay-75 -rotate-90"
          defaultActive={false}
          defaultHover={false}
          hover="group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0"
          active="active:scale-80"
          onClick={copyMessage}
        >
          <Copy />
        </Button>
      </div>
      <Paragraph text={{ size: "text-sm" }}>{sended}</Paragraph>
    </div>
  );
});
Message.displayName = "Message";
export default Message;
