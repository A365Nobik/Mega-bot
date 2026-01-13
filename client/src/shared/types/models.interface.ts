"use client";

import { memo } from "react";
import type { IModels } from "@/shared/types/models.interface";
import { Heading, Paragraph } from "@/components/custom";

interface ModelsCardProps {
  models: IModels | null;
}

const ModelsCard = memo(({ models }: ModelsCardProps) => {
  // 1️⃣ состояние загрузки
  if (!models) {
    return (
      <div className="flex justify-center items-center bg-(--bg-secondary) p-4 rounded-xl animate-pulse">
        <Heading text={{ size: "text-3xl", weight: "font-bold" }}>
          Модели загружаются...
        </Heading>
      </div>
    );
  }

  // 2️⃣ защита от кривых данных
  const modelsMap = models.models ?? {};
  const activeModels = Object.values(modelsMap).filter(
    (model) => model?.status === "active"
  );

  // 3️⃣ нет доступных моделей
  if (activeModels.length === 0) {
    return (
      <div className="flex justify-center items-center gap-4 animate-top-appear">
        <Heading text={{ size: "text-4xl" }}>
          В данный момент доступных моделей нет
        </Heading>
      </div>
    );
  }

  // 4️⃣ нормальный рендер
  return (
    <>
      <div className="flex justify-center items-center gap-4 animate-top-appear">
        <Heading text={{ size: "text-4xl" }}>
          Доступные модели:
        </Heading>
      </div>

      <div className="flex justify-center items-center gap-4 flex-wrap">
        {activeModels.map((model, index) => (
          <div
            key={`${model.name}-${index}`}
            className="bg-(--bg-secondary) rounded-xl space-y-2 p-4 hover:opacity-90 transition-all animate-top-appear"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <Heading>{model.name}</Heading>
            <hr className="text-(--text-primary)" />
            <Paragraph>{model.specialization}</Paragraph>
          </div>
        ))}
      </div>
    </>
  );
});

ModelsCard.displayName = "ModelsCard";
export default ModelsCard;

