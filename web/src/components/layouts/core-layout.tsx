"use client";

import { useState } from "react";
import Nav from "../core/Nav";
import SidebarNav from "../core/Sidebar";

const CoreLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full h-screen flex">
      <SidebarNav open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 h-screen overflow-auto">
        <Nav onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        {children}
      </div>
    </div>
  );
};

export default CoreLayout;
