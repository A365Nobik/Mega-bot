"use client";
import type { IModels } from "@/shared/types/models.interface";
// import { ModelsCardSkeleton } from "@/components/skeletons";
import { Heading, Paragraph } from "@/components/custom";

import { memo } from "react";

interface IProps {
  models: IModels | null;
}

const ModelsCard = memo(({ models }: IProps) => {
  return (
    <>
      {models?.available.length === 0 || !models ? (
        <div className="flex justify-center items-center gap-4">
          <Heading text={{ size: "text-4xl" }}>
            В данный момент доступных моделей нет
          </Heading>
        </div>
      ) : (
        <Heading
          text={{
            size: "text-4xl",
            className: "animate-top-appear delay-100",
          }}
        >
          Доступные модели:
        </Heading>
      )}
      {!models ? (
        <>
          <div className="flex justify-center items-center bg-(--bg-secondary) p-4 rounded-xl animate-pulse">
            <Heading text={{ size: "text-3xl", weight: "font-bold" }}>
              Модели загружаются...
            </Heading>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center gap-4">
            {Object.values(models.models)
              .filter((model) => model.status === "active")
              .map((model, index) => (
                <div
                  className="bg-(--bg-secondary) rounded-xl space-y-2 p-4 hover:opacity-90 transition-all animate-top-appear"
                  key={index}
                  style={{
                    animationDelay: `${index * 120}ms`,
                  }}
                >
                  <Heading>{model.name}</Heading>
                  <hr className="text-(--text-primary)" />
                  <Paragraph>{model.specialization}</Paragraph>
                </div>
              ))}
          </div>
        </>
      )}
    </>
  );
});
ModelsCard.displayName = "ModelsCard";
export default ModelsCard;
