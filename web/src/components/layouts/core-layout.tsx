"use client";

import { useState } from "react";
import Nav from "../core/Nav";
import SidebarNav from "../core/Sidebar";
import VectorBackground from "../backgrounds/VectorBackground";

const CoreLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full h-screen flex relative">
      {/*
      *
      <VectorBackground />
      * */}
      <div className="relative z-20">
        <SidebarNav open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>
      <div className="flex-1 h-screen flex flex-col relative z-10">
        <div className="sticky top-0 z-30 bg-black">
          <Nav onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>
        <div className="flex-1 overflow-auto">
          <div className="w-full p-8 flex justify-center">
            <div className="w-full max-w-7xl">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreLayout;
