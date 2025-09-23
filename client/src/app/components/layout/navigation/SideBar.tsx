import React from "react";
import { FiSidebar } from "react-icons/fi";

const SideBar: React.FC = () => {
  return (
    <aside className="h-screen w-20 bg-[var(--bg-secondary)] flex justify-center items-start p-6">
      <div className="text-3xl text-[var(--text-primary)]" title="Open sidebar">
        <FiSidebar />
      </div>
    </aside>
  );
};

export default SideBar;
