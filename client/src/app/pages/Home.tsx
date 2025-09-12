export default function Home() {
  return (
    <>
      <title>Домашняя страница</title>
      <div className="flex justify-center items-center">
        <div className="flex flex-col justify-center items-center w-[50%]">
          <h1 className="text-3xl">Mega-Bot</h1>
        </div>
        <div className="flex flex-col justify-center items-center bg-[#CBDCEB] w-[50%]">
          <h1>Тут будут примеры запросов и ответов</h1>
          <div className="w-40 h-20 bg-gray-800 rounded-2xl"></div>
        </div>
      </div>
    </>
  );
}
