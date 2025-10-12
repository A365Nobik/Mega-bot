"use client";
import { getModels } from "@/api";
import { useEffect, useState } from "react";
import type { IModels } from "@/shared/types/models.interface";
import { ModelsCardSkeleton } from "./skeletons";
import { Heading, Paragraph } from "./custom";
// interface IProps {}
const ModelsCard = () => {
  const [models, setModels] = useState<IModels | null>(null);
  const [error, setError] = useState<boolean | null>(false);
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await getModels();
        setModels(data);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    };
    fetchModels();
  }, []);
  return !models ? (
    <ModelsCardSkeleton />
  ) : (
    <>
      <Heading text={{ size: "text-4xl" }}>Доступные модели:</Heading>
      <div className="flex justify-center items-center gap-4">
        {Object.values(models.models).map((model, index) => (
          <div
            className="bg-[var(--bg-secondary)] rounded-xl space-y-2 p-4 transition-opacity hover:opacity-90"
            key={index}
          >
            <Heading>{model.name}</Heading>
            <hr className="text-[var(--text-primary)]" />
            <Paragraph>{model.specialization}</Paragraph>
          </div>
        ))}
      </div>
    </>
  );
};
export default ModelsCard;
