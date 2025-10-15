"use client";
import { getModels } from "@/api";
import { useEffect, useState } from "react";
import type { IModels } from "@/shared/types/models.interface";
import { ModelsCardSkeleton } from "./skeletons";
import { Heading, Paragraph } from "./custom";
import { motion } from "framer-motion";

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
        {Object.values(models.models)
          .filter((model) => model.status === "active")
          .map((model, index) => (
            <motion.div
              initial={{ y: -80 }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              className="bg-[var(--bg-secondary)] rounded-xl space-y-2 p-4 hover:opacity-90 transition-opacity"
              key={index}
            >
              <Heading>{model.name}</Heading>
              <hr className="text-[var(--text-primary)]" />
              <Paragraph>{model.specialization}</Paragraph>
            </motion.div>
          ))}
      </div>
    </>
  );
};
export default ModelsCard;
