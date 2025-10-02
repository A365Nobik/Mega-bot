const welcomeMessages: string[] = [
  "Добро пожаловать! Задвайте любой вопрос",
  "Добро пожаловать в MegaBot",
  "Готов помочь с любыми вопросами! ",
  "Привет! Чем могу помочь?",
  "Добро пожаловать! Чем могу помочь?  ",
];
export const getWelcomeMessages = (): string => {
  const randomIndex = Math.round(Math.random() * welcomeMessages.length);
  return welcomeMessages[randomIndex];
};
