import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/provider";

export const metadata: Metadata = {
  title: "Mega-bot",
  description:
    "Сайт, содержащий один чат, сразу с несколькими ИИ ассистентами.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-(--bg-primary) antialiased font-mako`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
