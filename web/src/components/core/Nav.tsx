"use client";

import { IconMenu2 } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

const Nav = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const pathname = usePathname();

  // Get the current section name from pathname
  const getSectionName = () => {
    if (pathname.startsWith('/app/strategies')) return 'strategies';
    if (pathname.startsWith('/app/dashboard')) return 'dashboard';
    if (pathname.startsWith('/app/marketplace')) return 'marketplace';
    return 'dashboard';
  };

  return (
    <div className="w-full flex items-center justify-between border-b h-[55px] bg-background px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-1 bg-neutral-800 hover:bg-primary/60 border transition-colors duration-300"
          aria-label="Toggle sidebar"
        >
          <IconMenu2 className="w-5 h-5 text-white/60 hover:text-white transition-colors duration-300" />
        </button>
        <div className="text-muted-foreground">
          // <span className="text-white text-sm uppercase">{getSectionName()}</span>
        </div>
      </div>
    </div>
  );
};

export default Nav;
