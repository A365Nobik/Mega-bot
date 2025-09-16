import { Greetings } from "@/app/components";

export default function Home() {
  return (
    <>
      <title>Домашняя страница</title>
      {/* если будет авторизация тогда тут будет юзер контекст и выбор компонента */}
      <Greetings/>
    </>
  );
}
