"use client";

import { type ReactNode } from "react";
import { ChatHistoryProvider } from "./HistoryProvider";

export const Providers = ({ children }: { children: ReactNode }) => {
  return <ChatHistoryProvider>{children}</ChatHistoryProvider>;
};
