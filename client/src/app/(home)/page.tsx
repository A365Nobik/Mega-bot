import { SideBar, Header } from "@/components";
import Chat from "@/components/chat/Chat";
// import { Paragraph } from "@/components";

export default function Home() {
  return (
    <>
      <title>Mega-Bot | Домашняя страница</title>
      <div className="flex h-screen">
        <SideBar />
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Header />
          <div className="flex-1 h-full p-4">
            <Chat />
          </div>
        </div>
      </div>
    </>
  );
}
