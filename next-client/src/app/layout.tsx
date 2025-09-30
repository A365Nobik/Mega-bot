import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/provider";

export const metadata: Metadata = {
  title: "Mega-bot",
  description: "Сайт, содержащий один чат, сразу с несолькоми ИИ ботами.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-[var(--bg-primary)]  antialiased font-mako`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
