import { Route, Routes } from "react-router";
import { Home, NotFound } from "./app/pages";
import React from "react";

interface RoutesProps {
  children?: React.ReactNode;
}

const MainRoutes: React.FC<RoutesProps> = ({ children }) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {children}
    </>
  );
};

export default MainRoutes;
