import React from "react";

const Greetings: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-1">
        <h1 className="text-[var(--text-primary)]">Представляем Мега-Бот </h1>
        <button>Опробовать</button>
        <hr />
      </div>
      <div>
        <h1>Описание...</h1>
      </div>
      <div>Примеры...</div>
      <div>Как работает...</div>
    </div>
  );
};
export default Greetings;
