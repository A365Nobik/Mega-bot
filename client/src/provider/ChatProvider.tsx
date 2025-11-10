"use client";
import React, { createContext, useEffect } from "react";
import type { IMessage } from "@/shared/types/chat/index";

interface ChatContextType {
  messages: IMessage[];
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  currentModel: string | null;
  clearMessages: () => void;
}

interface ChatProviderProps {
  children?: React.ReactNode;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  return { children };
};

export default ChatProvider;
