"use client";

import {
  useEffect,
  useState,
  useContext,
  createContext,
  useCallback,
  type ReactNode,
} from "react";

interface ChatHistoryContext {
  history: string[] | null;
  refreshHistory: () => void;
}

const ChatHistoryContext = createContext<ChatHistoryContext | undefined>(
  undefined,
);

export const ChatHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<string[] | null>(null);

  const refreshHistory = useCallback(() => {
    if (typeof window === "undefined") return;
    const historyItems: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key !== "theme") {
        historyItems.push(key);
      }
    }
    setHistory(historyItems);
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return (
    <ChatHistoryContext.Provider value={{ history, refreshHistory }}>
      {children}
    </ChatHistoryContext.Provider>
  );
};

export const useChatHistory = () => {
  const context = useContext(ChatHistoryContext);
  if (!context) {
    throw new Error(
      "useChatHistory должен использоваться вместе с ChatHistoryProvider",
    );
  }
  return context;
};
