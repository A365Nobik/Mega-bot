import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import MainRoutes from "./routes";
import { ThemeProvider } from "./app/context";
import { Header } from "./app/components";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Header />
        <MainRoutes></MainRoutes>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
