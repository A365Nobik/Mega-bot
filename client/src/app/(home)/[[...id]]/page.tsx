import { SideBar } from "@/components";
import Chat from "@/components/chat/Chat";

export default function ChatPage() {
  return (
    <>
      <div className="flex h-screen">
        <SideBar />
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Chat />
        </div>
      </div>
    </>
  );
}
