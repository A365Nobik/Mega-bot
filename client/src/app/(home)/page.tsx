import { SideBar, Header } from "@/components";
import Chat from "@/components/Chat";
import { Paragraph } from "@/components";

export default function Home() {
  return (
    <>
      <title>Mega-Bot | Домашняя страница</title>
      <div className="flex h-screen">
        <SideBar />
        <div className="flex-1 flex-col justify-center">
          <Header />
          <div className="flex-1">
            <Chat />
          </div>
        </div>
      </div>
    </>
  );
}
