"use client";
import { createPortal } from "react-dom";
import { useState, useEffect, memo } from "react";
import { Heading, Button, Paragraph } from "../custom";

interface Props {
  confirmAction: () => void;
  openState: boolean;
  setOpenState: (state: boolean) => void;
  questions: string;
  actionText: string;
  closeText: string;
}

const ModalConfirm = memo((props: Props) => {
  const [opacity, setOpacity] = useState<string>("opacity-0");

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity("opacity-100");
    }, 150);
    return () => clearTimeout(timer);
  }, [props.openState]);

  const closeModal = () => {
    setOpacity("opacity-0");
    setTimeout(() => {
      props.setOpenState(false);
    }, 350);
  };

  return createPortal(
    <div
      className={`inset-0 z-100 fixed flex justify-center items-center bg-black/50 duration-300 transition-all ${opacity}`}
    >
      <div className="delete-modal flex flex-col justify-around items-center w-[25%] h-[15%] max-xl:w-[45%] max-xl:h-[35%]  bg-(--bg-primary) rounded-xl p-4">
        <div className="flex flex-col gap-2 items-center">
          <Heading>{props.questions}</Heading>
          <Paragraph
            text={{ size: "text-md", color: "text-(--text-primary)/50" }}
          >
            После удаления вы не сможете восстановить ваши чаты
          </Paragraph>
        </div>
        <div className="flex items-center gap-6 text-(--text-primary) font-mako">
          <Button
            onClick={() => {
              props.confirmAction();
              closeModal();
            }}
            bg="bg-red-700"
            className="p-2 max-xl:p-1 rounded-md"
          >
            {props.actionText}
          </Button>
          <Button
            bg="bg-blue-700"
            className="p-2 max-xl:p-1 rounded-md"
            onClick={closeModal}
          >
            {props.closeText}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
});
ModalConfirm.displayName = "ModalConfirm";
export default ModalConfirm;
