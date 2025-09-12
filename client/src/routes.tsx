import { Route, Routes } from "react-router";
import { Home,NotFound } from "./app/pages";

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}
