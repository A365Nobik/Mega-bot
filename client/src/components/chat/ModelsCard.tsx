"use client";
import type { IModels } from "@/shared/types/models.interface";
import { ModelsCardSkeleton } from "@/components/skeletons";
import { Heading, Paragraph } from "@/components/custom";
import { motion } from "framer-motion";

interface IProps {
  models: IModels | null;
}

const ModelsCard = ({ models }: IProps) => {
  return (
    <>
      {models?.available.length === 0 ? (
        <Heading text={{ size: "text-4xl" }}>
          В данный момент доступных моделей нет
        </Heading>
      ) : (
        <Heading text={{ size: "text-4xl" }}>Доступные модели:</Heading>
      )}
      {!models ? (
        <>
          <div className="flex justify-center items-center gap-4">
            {Array(3)
              .fill(0)
              .map((_, idx) => (
                <ModelsCardSkeleton key={idx} />
              ))}
          </div>
        </>
      ) : (
        <>
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
      )}
    </>
  );
};
export default ModelsCard;
