import type { Timestamp } from "@/shared/types";

export const dateFormatter = (timestamp: Date | Timestamp | string): string => {
  if (!timestamp) return "Ошибка даты";
  
  let date: Date;
  
  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === "string") {
    date = new Date(timestamp);
  } else {
    date = new Date(timestamp as any);
  }
  
  if (isNaN(date.getTime())) {
    return "Ошибка даты";
  }
  
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) {
    return "только что";
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "минуту" : minutes < 5 ? "минуты" : "минут"} назад`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? "час" : hours < 5 ? "часа" : "часов"} назад`;
  } else if (days < 7) {
    return `${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"} назад`;
  } else {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
};




