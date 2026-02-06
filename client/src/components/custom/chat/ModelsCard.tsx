"use client";

import { memo } from "react";
import type { IModels } from "@/shared/types/models.interface";
import { Heading, Paragraph } from "@/components/custom";

interface ModelsCardProps {
  models: IModels | null;
}

const ModelsCard = memo(({ models }: ModelsCardProps) => {
  if (!models) {
    return (
      <div className="flex justify-center items-center bg-(--bg-secondary) p-4 max-xl:p-2 rounded-md animate-pulse ">
        <Paragraph
          text={{
            size: "text-3xl",
            weight: "font-bold max-xl:font-normal",
          }}
        >
          Модели загружаются...
        </Paragraph>
      </div>
    );
  }

  const modelsMap = models.models ?? {};
  const activeModels = Object.values(modelsMap).filter(
    (model) => model?.status === "active",
  );

  if (activeModels.length === 0) {
    return (
      <div className="flex justify-center items-center gap-4 animate-top-appear">
        <Heading text={{ size: "text-4xl" }}>
          В данный момент доступных моделей нет
        </Heading>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center items-center gap-4 animate-top-appear">
        <Heading text={{ size: "text-4xl" }}>Доступные модели:</Heading>
      </div>

      <div className="flex justify-center items-center gap-4">
        {activeModels.map((model, index) => (
          <div
            key={`${model.name}-${index}`}
            className="h-full bg-(--bg-secondary) rounded-xl space-y-2 p-4 max-xl:p-2 hover:opacity-90 transition-all animate-top-appear"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <Paragraph text={{ size: "text-2xl" }}>{model.name}</Paragraph>
            <hr className="text-(--text-primary)" />
            <Paragraph
              text={{ responseSize: false, size: "text-lg max-xl:text-[16px]" }}
            >
              {model.specialization}
            </Paragraph>
          </div>
        ))}
      </div>
    </>
  );
});

ModelsCard.displayName = "ModelsCard";
export default ModelsCard;
