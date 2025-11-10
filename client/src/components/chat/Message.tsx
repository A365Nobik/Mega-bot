import type { IMessage } from "@/shared/types/chat";
import { Paragraph } from "@/components/custom";

interface IProps {
  message: IMessage;
}
const Message = ({ message }: IProps) => {
  return (
    <div
      className={`bg-[var(--bg-secondary)] p-4 rounded-lg max-w-[80%] ${
        message.sender === "user" ? "self-end" : "self-start"
      }`}
    >
      {/* <Paragraph>{message.sender}</Paragraph> */}
      <Paragraph>{message.model}</Paragraph>
      <Paragraph>{message.text}</Paragraph>
      <Paragraph>{message.timestamp?.toLocaleDateString()}</Paragraph>
    </div>
  );
};
export default Message;
