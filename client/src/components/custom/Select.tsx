"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

type Props = {
  content: string[];
  container?: HTMLElement | null;
  gap?: string;
  bg?: string;
  p?: string;
  customAppear?: string;
  round?: string;
};

  


const Select = ({ ...props }: Props) => {
  const [host, setHost] = useState<HTMLElement | null>(null);


  useEffect(() => {
    if (typeof window === "undefined") return;
    setHost(props.container ?? document.body);
  }, [props]);

  if (!host) return;

  return createPortal(
    <motion.ul
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col justify-center items-center ${
        props.gap ? props.gap : "gap-0"
      } ${props.bg ? props.bg : "bg-none"} ${props.p ? props.p : "p-0"} ${
        props.customAppear ? props.customAppear : "animate-bottom-appear "
      } ${props.round ? props.round : "rounded-xl"} `}
    >
      {...props.content.map((el, idx) => (
        <li className="text-white" key={idx}>
          {el}
        </li>
      ))}
    </motion.ul>,
    host
  );
};

export default Select;
